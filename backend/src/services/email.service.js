const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');
console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS exists:", !!EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // Force IPv4
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
  await transporter.verify();
  console.log("SMTP Connected");
  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };