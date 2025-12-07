// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { placeOrder, getKioskOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, placeOrder);                    // place BNPL order
router.get('/kiosk/:kioskId', protect, getKioskOrders);   // kiosk order history
router.put('/:id/status', protect, admin, updateOrderStatus); // admin updates order status

module.exports = router;
