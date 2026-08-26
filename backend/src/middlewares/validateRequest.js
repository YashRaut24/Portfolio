const { body, validationResult } = require('express-validator');

// Common temporary/disposable email domains to filter spam
const disposableDomains = [
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'throwawaymail.com', 'trashmail.com', 'yopmail.com', 'sharklasers.com',
  'getairmail.com', 'dispostable.com', 'temp-mail.org'
];

const contactValidationRules = [
  // Anti-Bot: Honeypot check (hidden field should always be empty)
  body('website')
    .trim()
    .custom((value) => {
      if (value) {
        throw new Error('Automated submission detected.');
      }
      return true;
    }),
    
  // Anti-Bot: Minimum interaction time check (at least 400ms to allow browser autofill)
  body('timeToComplete')
    .optional()
    .custom((value) => {
      if (value !== undefined && value !== null) {
        const time = parseInt(value, 10);
        if (!isNaN(time) && time < 400) {
          throw new Error('Form submitted too quickly.');
        }
      }
      return true;
    }),

  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be valid text')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .custom((email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      if (domain && disposableDomains.includes(domain)) {
        throw new Error('Temporary disposable email addresses are not allowed.');
      }
      return true;
    }),
    
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isString().withMessage('Message must be valid text')
    .isLength({ min: 5, max: 3000 }).withMessage('Message must be between 5 and 3000 characters'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg,
      errors: errors.array() 
    });
  }
  next();
};

module.exports = { contactValidationRules, validate };