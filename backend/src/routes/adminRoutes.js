const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Kiosk = require('../models/kiosk');
const Order = require('../models/order');

// GET all kiosks with orders
router.get('/kiosks', protect, admin, async (req, res) => {
  const kiosks = await Kiosk.find()
    .populate('user', 'email')
    .lean();

  for (let kiosk of kiosks) {
    kiosk.orders = await Order.find({ kiosk: kiosk._id });
  }

  res.json(kiosks);
});

module.exports = router;
