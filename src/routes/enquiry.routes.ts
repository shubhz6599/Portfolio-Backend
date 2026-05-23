import { createHash } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { EnquiryModel } from '../models.js';
import { sendEnquiryNotification } from '../services/mail.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const enquiryRoutes = Router();

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(24).optional().or(z.literal('')),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  projectType: z.string().trim().min(2).max(80),
  budget: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(20).max(1800),
  consent: z.literal(true)
});

function hashIp(ip?: string): string | undefined {
  if (!ip) {
    return undefined;
  }

  return createHash('sha256').update(ip).digest('hex');
}

enquiryRoutes.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = enquirySchema.parse(req.body);

    const enquiry = await EnquiryModel.create({
      ...payload,
      ipHash: hashIp(req.ip),
      userAgent: req.get('user-agent'),
      emailStatus: 'pending'
    });

    const emailResult = await sendEnquiryNotification(payload, enquiry.id);

    enquiry.emailStatus = emailResult.status;
    enquiry.emailError = emailResult.error;
    await enquiry.save();

    res.status(201).json({
      enquiryId: enquiry.id,
      message:
        emailResult.status === 'sent'
          ? 'Enquiry received and emailed to Shubham.'
          : 'Enquiry received. Email delivery is pending configuration.'
    });
  })
);
