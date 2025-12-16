const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =======================
// Generate JWT
// =======================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// =======================
// @desc    Register user
// @route   POST /api/auth/register
// =======================
const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  // ⚠️ IMPORTANT:
  // Do NOT hash here.
  // Password will be hashed automatically in User model (pre-save hook)
  const user = await User.create({
    email,
    password, // plain password
    role: role || 'kiosk',
  });

  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// =======================
// @desc    Login user
// @route   POST /api/auth/login
// =======================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password because it is hidden in the model
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// =======================
// @desc    Get current user
// @route   GET /api/auth/me
// =======================
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  register,
  login,
  getMe,
};
