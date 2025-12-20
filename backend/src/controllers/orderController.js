const asyncHandler = require('express-async-handler');
const Order = require('../models/order');
const Kiosk = require('../models/kiosk');
const mongoose = require('mongoose');

// =======================
// KIOSK: Place Order
// =======================
const placeOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items provided');
  }

  const kiosk = await Kiosk.findOne({ user: req.user._id });
  if (!kiosk) {
    res.status(400);
    throw new Error('Kiosk not found');
  }

  if (kiosk.outstandingBalance + totalAmount > kiosk.creditLimit) {
    res.status(400);
    throw new Error('Credit limit exceeded');
  }

  // 🔥 FINAL NORMALIZATION (THIS FIXES EVERYTHING)
  const normalizedItems = items.map(item => ({
    product: item.product || new mongoose.Types.ObjectId(),
    qty: item.qty || item.quantity || 1,   // ✅ REQUIRED FIELD
    price: item.price,
  }));

  const order = await Order.create({
    kiosk: kiosk._id,
    items: normalizedItems,
    totalAmount,
    status: 'placed', // ✅ VALID ENUM
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  kiosk.outstandingBalance += totalAmount;
  await kiosk.save();

  res.status(201).json(order);
});

// =======================
// KIOSK: Get My Orders
// =======================
const getMyOrders = asyncHandler(async (req, res) => {
  const kiosk = await Kiosk.findOne({ user: req.user._id });
  if (!kiosk) {
    res.status(404);
    throw new Error('Kiosk not found');
  }

  const orders = await Order.find({ kiosk: kiosk._id });
  res.json(orders);
});

// =======================
// ADMIN: Get All Orders
// =======================
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('kiosk');
  res.json(orders);
});

// =======================
// ADMIN: Orders by Kiosk
// =======================
const getOrdersByKiosk = asyncHandler(async (req, res) => {
  const orders = await Order.find({ kiosk: req.params.id });
  res.json(orders);
});

// =======================
// ADMIN: Update Order Status
// =======================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = [
    'placed',
    'approved',
    'dispatched',
    'delivered',
    'repaid',
    'overdue',
    'cancelled',
  ];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.json(order);
});

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrdersByKiosk,
  updateOrderStatus,
};
