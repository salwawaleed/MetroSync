const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { login } = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({
    success: false,
    message: 'Too many login attempts. Try again later.',
  }),
});

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

router.post('/login', loginLimiter, loginValidation, login);

module.exports = router;
