// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();

const {
  createProduct,
  listProducts,
  getProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/auth');

router.get('/', listProducts);
router.get('/:id', getProduct);

// admin creates product
router.post('/', protect, admin, createProduct);

module.exports = router;
