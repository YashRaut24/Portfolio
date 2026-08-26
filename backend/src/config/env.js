require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  EMAIL_USER: process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '',
  EMAIL_PASS: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
  RESEND_API_KEY: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : '',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};