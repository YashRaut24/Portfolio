const express = require('express');
const router = express.Router();

module.exports = router;const { sendContactEmail } = require('../services/email.service');

const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    await sendContactEmail({ name, email, message });
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContactForm };