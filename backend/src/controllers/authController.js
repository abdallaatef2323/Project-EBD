// src/controllers/authController.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// Register new user
const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    res.status(400); throw new Error('Email and password required');
  }
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already in use'); }
  const user = await User.create({ email, password:hashedPassword, role: role || 'kiosk' });
  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, password:hashedPassword} = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password required'); }
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401); throw new Error('Invalid credentials');
  }
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  res.json({ _id: req.user._id, email: req.user.email, role: req.user.role });
});

module.exports = { register, login, getMe };
