const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrdersByKiosk,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/auth');

// MAIN ORDERS
router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);

// ADMIN
router.get('/all', protect, admin, getAllOrders);
router.get('/kiosk/:id', protect, admin, getOrdersByKiosk);
router.put('/:id/status', protect, admin, updateOrderStatus);

// ===== BNPL (UNCHANGED) =====
let bnplOrders = [];

router.post('/bnpl', protect, (req, res) => {
  const { items, totalAmount } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No items in order' });

  const newOrder = {
    _id: Date.now().toString(),
    user: req.user._id.toString(),
    totalAmount,
    status: 'pending',
  };

  bnplOrders.push(newOrder);
  res.status(201).json(newOrder);
});

router.get('/bnpl', protect, (req, res) => {
  if (req.user.role === 'admin') return res.json(bnplOrders);
  res.json(bnplOrders.filter(o => o.user === req.user._id.toString()));
});

router.put('/bnpl/:id/cancel', protect, (req, res) => {
  const order = bnplOrders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = 'cancelled';
  res.json(order);
});

router.put('/bnpl/:id/approve', protect, admin, (req, res) => {
  const order = bnplOrders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = 'approved';
  res.json(order);
});

module.exports = router;
