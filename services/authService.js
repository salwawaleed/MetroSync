const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

  if (!admin) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  if (!process.env.JWT_SECRET) {
    const err = new Error('JWT_SECRET is not configured');
    err.status = 500;
    throw err;
  }

  const token = jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

  return { token };
};

module.exports = { loginAdmin };
