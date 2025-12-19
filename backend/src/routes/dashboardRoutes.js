const express = require('express');
const router = express.Router();

const { adminDashboard } = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin dashboard
router.get('/admin', protect, adminOnly, adminDashboard);

module.exports = router;
