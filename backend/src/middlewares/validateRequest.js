const { body, validationResult } = require('express-validator');
const emailValidator = require('deep-email-validator');

// Common free providers we still want to manually block (since they are real, but not company/gmail)
const blockedPersonalDomains = [
  'yahoo.com', 'yahoo.in', 'hotmail.com', 'outlook.com', 
  'aol.com', 'yandex.com', 'mail.com', 'zoho.com', 'icloud.com', 'live.com'
];

const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 })
    .escape(),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async (email) => {
      const domain = email.split('@')[1].toLowerCase();

      // 1. Explicitly allow Gmail (bypasses heavy checks to save time)
      if (domain === 'gmail.com' || domain === 'googlemail.com') {
        return true; 
      }

      // 2. Block standard non-Gmail personal accounts
      if (blockedPersonalDomains.includes(domain)) {
        throw new Error('Please use a Gmail or official company email address.');
      }

      // 3. Deep validation for everything else (Business domains)
      const { valid, validators } = await emailValidator.validate({
        email: email,
        validateRegex: true,
        validateDisposable: true, // This blocks xmail, mailinator, temp-mail, etc.
        validateMx: true,         // Ensures the domain actually has mail servers
        validateTypo: false,
        validateSMTP: false       // Kept false so your API responds quickly
      });

      // If the package flags the email as invalid, throw specific errors
      if (!valid) {
        if (validators.disposable && !validators.disposable.valid) {
          throw new Error('Temporary or random email domains are not allowed.');
        }
        if (validators.mx && !validators.mx.valid) {
          throw new Error('This email domain does not actually exist.');
        }
        throw new Error('Please provide a valid Gmail or company email address.');
      }

      // If it passes all checks, it's assumed to be a valid company email
      return true;
    }),
    
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 })
    .escape(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { contactValidationRules, validate };