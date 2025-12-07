
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sku: { type: String, index: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, index: true },
  imageUrl: String,
  availableQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
