const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('../config/env');
console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS exists:", !!EMAIL_PASS);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
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