// src/routes/kioskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createKiosk,
  getKiosk,
  updateKiosk,
  deleteKiosk,
  getMyKiosk,
  listKiosks,
  adjustCredit
} = require('../controllers/kioskController');

const { protect, admin } = require('../middleware/auth');

// IMPORTANT: order matters. /me and / (list) must be before /:id
router.post('/', protect, createKiosk);

// return kiosk for the logged-in user
router.get('/me', protect, getMyKiosk);

// admin-only: list all kiosks
router.get('/', protect, admin, listKiosks);

// kiosk by id (get, update, delete)
router.get('/:id', protect, getKiosk);
router.put('/:id', protect, updateKiosk);
router.delete('/:id', protect, deleteKiosk);

// admin adjust credit
router.post('/:id/credit/adjust', protect, admin, adjustCredit);

module.exports = router;

