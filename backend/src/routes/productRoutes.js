// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { createProduct, listProducts, getProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct); // admin creates product

module.exports = router;
