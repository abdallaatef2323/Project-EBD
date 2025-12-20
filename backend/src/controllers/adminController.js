const asyncHandler = require('express-async-handler');
const Admin = require('../models/admin');
const Kiosk = require('../models/kiosk');
const Order = require('../models/order');

// =======================
// GET ADMIN PROFILE
// =======================
const getMyAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ user: req.user._id })
    .populate('user', 'email role');

  if (!admin) {
    res.status(404);
    throw new Error('Admin profile not found');
  }

  res.json(admin);
});

// =======================
// ADMIN ANALYTICS
// =======================
const getAdminAnalytics = asyncHandler(async (req, res) => {
  const kiosks = await Kiosk.countDocuments();
  const pendingKiosks = await Kiosk.countDocuments({ status: 'pending' });
  const orders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });

  res.json({
    kiosks,
    pendingKiosks,
    orders,
    pendingOrders,
  });
});

module.exports = {
  getMyAdminProfile,
  getAdminAnalytics,
};
