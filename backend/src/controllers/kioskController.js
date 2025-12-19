const asyncHandler = require('express-async-handler');
const Kiosk = require('../models/kiosk');
const Order = require('../models/order');

// =======================
// GET /api/kiosks/me
// =======================
const getMyKiosk = asyncHandler(async (req, res) => {
  const kiosk = await Kiosk.findOne({ user: req.user._id });

  if (!kiosk) {
    res.status(404);
    throw new Error('Kiosk not found');
  }

  res.json(kiosk);
});

// =======================
// POST /api/kiosks
// =======================
const createKiosk = asyncHandler(async (req, res) => {
  const { kioskName, ownerName, phone, address } = req.body;

  const exists = await Kiosk.findOne({ user: req.user._id });
  if (exists) {
    res.status(400);
    throw new Error('Kiosk already exists');
  }

  const kiosk = await Kiosk.create({
    user: req.user._id,
    kioskName,
    ownerName,
    phone,
    address,
    status: 'pending',
    creditLimit: 0,
    outstandingBalance: 0,
  });

  res.status(201).json(kiosk);
});

// =======================
// ADMIN: GET ALL KIOSKS
// =======================
const listKiosks = asyncHandler(async (req, res) => {
  const kiosks = await Kiosk.find().populate('user', 'email role');
  res.json(kiosks);
});

// =======================
// ADMIN: APPROVE / REJECT KIOSK
// =======================
const approveKiosk = asyncHandler(async (req, res) => {
  const { status } = req.body; // approved | rejected

  const kiosk = await Kiosk.findById(req.params.id);
  if (!kiosk) {
    res.status(404);
    throw new Error('Kiosk not found');
  }

  kiosk.status = status;
  await kiosk.save();

  res.json(kiosk);
});

// =======================
// ADMIN: VIEW KIOSK ORDERS
// =======================
const getKioskOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ kiosk: req.params.id });
  res.json(orders);
});

module.exports = {
  getMyKiosk,
  createKiosk,
  listKiosks,
  approveKiosk,
  getKioskOrders,
};
