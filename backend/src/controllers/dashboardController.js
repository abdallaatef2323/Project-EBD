const asyncHandler = require('express-async-handler');
const Kiosk = require('../models/kiosk');
const Order = require('../models/order');

// =======================
// @desc    Admin dashboard (all kiosks + credit + orders)
// @route   GET /api/dashboard/admin
// @access  Admin
// =======================
const adminDashboard = asyncHandler(async (req, res) => {
  // get all kiosks with user info
  const kiosks = await Kiosk.find()
    .populate('user', 'email role')
    .lean();

  // get all orders for these kiosks
  const kioskIds = kiosks.map(k => k._id);
  const orders = await Order.find({ kiosk: { $in: kioskIds } });

  // attach orders + credit usage per kiosk
  const result = kiosks.map(kiosk => {
    const kioskOrders = orders.filter(
      o => o.kiosk.toString() === kiosk._id.toString()
    );

    const creditUsed = kioskOrders
      .filter(o => o.status === 'approved')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      ...kiosk,
      creditUsed,
      orders: kioskOrders
    };
  });

  res.json(result);
});

module.exports = { adminDashboard };
