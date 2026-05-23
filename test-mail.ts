import { sendEnquiryNotification } from './src/services/mail.service';

async function testMail() {
  console.log('Testing Gmail SMTP configuration...\n');

  const testPayload = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    company: 'Test Company',
    projectType: 'Web Development',
    budget: '$5000',
    message: 'This is a test message to verify Gmail SMTP is working correctly.'
  };

  const result = await sendEnquiryNotification(testPayload, 'TEST-' + Date.now());
  
  console.log('\n=== Email Test Result ===');
  console.log('Status:', result.status);
  
  if (result.error) {
    console.log('Error:', result.error);
  }
  
  if (result.status === 'sent') {
    console.log('✓ Email sent successfully!');
  } else if (result.status === 'skipped') {
    console.log('⚠ Email skipped:', result.error);
  } else {
    console.log('✗ Email failed:', result.error);
  }
}

testMail().catch(console.error);
