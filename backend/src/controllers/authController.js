const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Admin = require('../models/admin');
const Kiosk = require('../models/kiosk');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// =======================
// REGISTER
// =======================
const register = asyncHandler(async (req, res) => {
  const { email, password, role, fullName } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || 'kiosk',
  });

  // ✅ AUTO CREATE ADMIN PROFILE
  if (user.role === 'admin') {
    await Admin.create({
      user: user._id,
      fullName: fullName || 'System Administrator',
    });
  }

  // ✅ AUTO CREATE KIOSK PROFILE
  if (user.role === 'kiosk') {
    await Kiosk.create({
      user: user._id,
      kioskName: 'New Kiosk',
      ownerName: 'Owner',
      phone: '0000000000',
      status: 'pending',
    });
  }

  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// =======================
// LOGIN
// =======================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
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
// GET ME
// =======================
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { register, login, getMe };
