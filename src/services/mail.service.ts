import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

interface EnquiryMailPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
}

type MailStatus = 'sent' | 'skipped' | 'failed';

interface MailResult {
  status: MailStatus;
  error?: string;
}

function escapeHtml(value = ''): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createTransporter() {
  const isConfigured = !!env.SMTP_HOST && !!env.SMTP_USER && !!env.SMTP_PASS;

  if (!isConfigured) {
    console.error('SMTP configuration missing:', {
      SMTP_HOST: !!env.SMTP_HOST,
      SMTP_USER: !!env.SMTP_USER,
      SMTP_PASS: !!env.SMTP_PASS
    });
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

export async function sendEnquiryNotification(
  payload: EnquiryMailPayload,
  enquiryId: string
): Promise<MailResult> {
  const transporter = createTransporter();
  console.log('Enquiry payload:', payload);
  if (!transporter) {
    return { status: 'skipped', error: 'SMTP is not configured.' };
  }

  const rows = [
    ['Reference', enquiryId],
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone || 'Not provided'],
    ['Company', payload.company || 'Not provided'],
    ['Project type', payload.projectType],
    ['Budget', payload.budget || 'Not provided']
  ];

  const text = [
    `New portfolio enquiry: ${enquiryId}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    payload.message
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111512">
      <h2>New portfolio enquiry</h2>
      <p><strong>Reference:</strong> ${escapeHtml(enquiryId)}</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #ddd">${escapeHtml(value)}</td></tr>`
          )
          .join('')}
      </table>
      <h3>Message</h3>
      <p>${escapeHtml(payload.message).replace(/\n/g, '<br>')}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: env.MAIL_TO,
      replyTo: payload.email,
      subject: `Portfolio enquiry: ${payload.projectType}`,
      text,
      html
    });

    if (env.AUTO_REPLY_ENABLED) {
      await transporter.sendMail({
        from: env.MAIL_FROM,
        to: payload.email,
        subject: 'Thanks for contacting Shubham Karkhile',
        text:
          `Hi ${payload.name},\n\n` +
          'Thanks for reaching out. I received your enquiry and will reply soon.\n\n' +
          `Reference: ${enquiryId}\n\n` +
          'Regards,\nShubham Karkhile'
      });
    }

    return { status: 'sent' };
  } catch (error) {
    return {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown email error'
    };
  }
}
