const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS, RESEND_API_KEY } = require('../config/env');

let resendClient = null;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
  console.log('✅ Resend HTTP API email service initialized');
}

const createNodemailerTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    family: 4,
  });
};

const transporter = createNodemailerTransporter();

const sendContactEmail = async ({ name, email, message }) => {
  const recipientEmail = EMAIL_USER || 'yashdr2405@gmail.com';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa;">
      <h2 style="color: #333; margin-top: 0;">📬 New Portfolio Contact Message</h2>
      <p style="margin-bottom: 8px;"><strong>From:</strong> ${name}</p>
      <p style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <div style="margin-top: 20px; padding: 15px; background: #ffffff; border-radius: 6px; border-left: 4px solid #4f46e5;">
        <p style="margin: 0; white-space: pre-wrap; color: #444; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    </div>
  `;
  const textContent = `You received a new message from your portfolio contact form:\n\n` +
                      `Name: ${name}\n` +
                      `Email: ${email}\n\n` +
                      `Message:\n${message}\n`;

  // 1. Preferred method: Resend HTTP API (works 100% on Render / Cloud without SMTP restrictions)
  if (resendClient) {
    const { data, error } = await resendClient.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipientEmail],
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message || 'Failed to send email via Resend API');
    }

    return data;
  }

  // 2. Fallback method: Nodemailer SMTP
  if (transporter && EMAIL_USER && EMAIL_PASS) {
    const mailOptions = {
      from: `"${name}" <${EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Portfolio Contact: Message from ${name}`,
      text: textContent,
      html: htmlContent,
    };

    return await transporter.sendMail(mailOptions);
  }

  throw new Error('No email provider is configured. Please add RESEND_API_KEY in your environment variables.');
};

module.exports = { sendContactEmail };