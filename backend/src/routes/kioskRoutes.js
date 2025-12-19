const express = require('express');
const router = express.Router();

const {
  createKiosk,
  getMyKiosk,
  listKiosks,
  approveKiosk,
  getKioskOrders,
} = require('../controllers/kioskController');

const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createKiosk);
router.get('/me', protect, getMyKiosk);

// admin
router.get('/', protect, admin, listKiosks);
router.put('/:id/status', protect, admin, approveKiosk);
router.get('/:id/orders', protect, admin, getKioskOrders);

module.exports = router;
