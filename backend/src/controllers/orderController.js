const asyncHandler = require('express-async-handler');
const Order = require('../models/order');
const Kiosk = require('../models/kiosk');

// =======================
// KIOSK: Place Order
// POST /api/orders
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

  const order = await Order.create({
    kiosk: kiosk._id,
    items,
    totalAmount,
    status: 'pending',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  kiosk.outstandingBalance += totalAmount;
  await kiosk.save();

  res.status(201).json(order);
});

// =======================
// KIOSK: Get My Orders
// GET /api/orders
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
// GET /api/orders/all
// =======================
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('kiosk');
  res.json(orders);
});

// =======================
// ADMIN: Orders by Kiosk
// GET /api/orders/kiosk/:id
// =======================
const getOrdersByKiosk = asyncHandler(async (req, res) => {
  const orders = await Order.find({ kiosk: req.params.id });
  res.json(orders);
});

// =======================
// ADMIN: Update Order Status
// PUT /api/orders/:id/status
// =======================
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

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
