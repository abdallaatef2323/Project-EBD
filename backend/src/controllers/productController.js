// src/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
// create product (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) { res.status(400); throw new Error('Missing product name/price'); }
  const p = await Product.create(req.body);
  res.status(201).json(p);
});

// list and search products
const listProducts = asyncHandler(async (req, res) => {
  const { q, category, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  const skip = (Number(page) - 1) * Number(limit);
  const products = await Product.find(filter).skip(skip).limit(Number(limit));
  res.json(products);
});

// get single product
const getProduct = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) { res.status(404); throw new Error('Product not found'); }
  res.json(p);
});

module.exports = { createProduct, listProducts, getProduct };
