const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, (req, res) => {
  res.json({
    totalOrders: 1,
    creditUsed: 80,
    creditLimit: 500
  });
});

module.exports = router;
