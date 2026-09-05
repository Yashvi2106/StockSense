const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updatePreferences,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Register validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate
];

// Login validation rules
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Preferences validation rules
const preferencesValidation = [
  body('theme')
    .optional()
    .isIn(['dark', 'light'])
    .withMessage('Theme must be dark or light'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD'])
    .withMessage('Currency must be INR or USD'),
  body('emailAlerts')
    .optional()
    .isBoolean()
    .withMessage('emailAlerts must be a boolean'),
  validate
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/preferences', protect, preferencesValidation, updatePreferences);
router.post('/logout', logout);

module.exports = router;
