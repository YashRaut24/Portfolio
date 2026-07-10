const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contact.controller');
const contactLimiter = require('../middlewares/rateLimiter');
const { contactValidationRules, validate } = require('../middlewares/validateRequest');

router.post('/', contactLimiter, contactValidationRules, validate, submitContactForm);

module.exports = router;