const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn('⚠️ Warning: EMAIL_USER or EMAIL_PASS is not configured in .env');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    family: 4, // Strictly force IPv4 socket (prevents ENETUNREACH IPv6 connection errors on Render)
  });
};

const transporter = createTransporter();

// Verify connection configuration on startup
if (EMAIL_USER && EMAIL_PASS) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Gmail SMTP Verification Failed:', error.message);
    } else {
      console.log('✅ Gmail SMTP Server is ready to send emails');
    }
  });
}

const sendContactEmail = async ({ name, email, message }) => {
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email service credentials are not configured on the backend server.');
  }

  const mailOptions = {
    from: `"${name}" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    replyTo: email,
    subject: `Portfolio Contact: Message from ${name}`,
    text: `You received a new message from your portfolio contact form:\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n\n` +
          `Message:\n${message}\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa;">
        <h2 style="color: #333; margin-top: 0;">📬 New Portfolio Contact Message</h2>
        <p style="margin-bottom: 8px;"><strong>From:</strong> ${name}</p>
        <p style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <div style="margin-top: 20px; padding: 15px; background: #ffffff; border-radius: 6px; border-left: 4px solid #4f46e5;">
          <p style="margin: 0; white-space: pre-wrap; color: #444; line-height: 1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };