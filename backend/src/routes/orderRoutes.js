const express = require('express');
const router = express.Router();

// Import your controller functions
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrdersByKiosk,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/auth');

// In-memory storage for friend's BNPL features
let bnplOrders = [];

// ==================== YOUR ROUTES (Controller-based) ====================
// Kiosk routes
router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);

// Admin routes  
router.get('/all', protect, admin, getAllOrders);
router.get('/kiosk/:id', protect, admin, getOrdersByKiosk);
router.put('/:id/status', protect, admin, updateOrderStatus);

// ==================== FRIEND'S ROUTES (BNPL/Kiosk Features) ====================

// CREATE BNPL ORDER (KIOSK) - Friend's feature
router.post('/bnpl', protect, (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  const newOrder = {
    _id: Date.now().toString(),
    user: req.user._id.toString(),
    totalAmount,
    status: 'pending',
  };

  bnplOrders.push(newOrder);
  res.status(201).json(newOrder);
});

// GET BNPL ORDERS - Friend's feature
router.get('/bnpl', protect, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json(bnplOrders);
  }

  const userOrders = bnplOrders.filter(
    o => o.user === req.user._id.toString()
  );
  res.json(userOrders);
});

// CANCEL BNPL ORDER (KIOSK) - Friend's feature
router.put('/bnpl/:id/cancel', protect, (req, res) => {
  const order = bnplOrders.find(o => o._id === req.params.id);

  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user !== req.user._id.toString())
    return res.status(403).json({ message: 'Not allowed' });
  if (order.status !== 'pending')
    return res.status(400).json({ message: 'Cannot cancel this order' });

  order.status = 'cancelled';
  res.json(order);
});

// APPROVE BNPL ORDER (ADMIN) - Friend's feature
router.put('/bnpl/:id/approve', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }

  const order = bnplOrders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = 'approved';
  res.json(order);
});

module.exports = router;