const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 5,
  maxMessages: 100, 
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendContactEmail = async ({ name, email, message }) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    replyTo: email,
    subject: `New portfolio contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };