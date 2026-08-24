const { validationResult } = require('express-validator');
const { loginAdmin } = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Invalid login input');
      err.status = 400;
      err.details = errors.array();
      return next(err);
    }

    const { token } = await loginAdmin(req.body.email, req.body.password);
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
