const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
  getMyAdminProfile,
  getAdminAnalytics,
} = require('../controllers/adminController');

router.get('/me', protect, admin, getMyAdminProfile);
router.get('/analytics', protect, admin, getAdminAnalytics);

module.exports = router;
