// src/controllers/orderController.js
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const Kiosk = require('../models/Kiosk');
const Transaction = require('../models/Transaction');

/**
 * placeOrder:
 * - body: { kioskId, items: [{ productId, qty }] }
 * - compute total, check available credit = creditLimit - outstandingBalance
 * - creditUsed = min(availableCredit, total)
 * - If creditUsed === total => status = 'approved' else 'placed'
 * - create order, create disbursement transaction for creditUsed, update kiosk.outstandingBalance
 */
const placeOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { kioskId, items } = req.body;
    if (!kioskId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400); throw new Error('Missing kioskId or items');
    }

    const kiosk = await Kiosk.findById(kioskId).session(session);
    if (!kiosk) { res.status(404); throw new Error('Kiosk not found'); }

    // build order items and total
    let total = 0;
    const orderItems = [];

    for (const it of items) {
      const product = await Product.findById(it.productId).session(session);
      if (!product) { await session.abortTransaction(); res.status(404); throw new Error(`Product ${it.productId} not found`); }
      const qty = Number(it.qty) || 1;
      const subTotal = product.price * qty;
      total += subTotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        qty,
        subTotal
      });
    }

    const availableCredit = (kiosk.creditLimit || 0) - (kiosk.outstandingBalance || 0);
    const creditUsed = Math.max(0, Math.min(availableCredit, total));
    const status = creditUsed === total ? 'approved' : 'placed';
    const dueDate = creditUsed > 0 ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null; // 14 days

    const [created] = await Order.create([{
      kiosk: kiosk._id,
      items: orderItems,
      totalAmount: total,
      creditUsed,
      status,
      dueDate
    }], { session });

    if (creditUsed > 0) {
      await Transaction.create([{
        kiosk: kiosk._id,
        order: created._id,
        amount: creditUsed,
        type: 'disbursement',
        method: 'wallet',
        note: 'BNPL disbursement for order'
      }], { session });

      kiosk.outstandingBalance = (kiosk.outstandingBalance || 0) + creditUsed;
      await kiosk.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const populated = await Order.findById(created._id).populate('kiosk').populate('items.product');
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

// get orders for a kiosk
const getKioskOrders = asyncHandler(async (req, res) => {
  const kioskId = req.params.kioskId;
  const orders = await Order.find({ kiosk: kioskId }).sort({ placedAt: -1 });
  res.json(orders);
});

// admin/ops: update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const { status } = req.body;
  if (!status) { res.status(400); throw new Error('status is required'); }
  order.status = status;
  await order.save();
  res.json(order);
});

module.exports = { placeOrder, getKioskOrders, updateOrderStatus };
