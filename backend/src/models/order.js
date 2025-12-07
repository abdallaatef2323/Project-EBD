
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, // snapshot
  price: Number,
  qty: { type: Number, required: true },
  subTotal: Number
});

const OrderSchema = new mongoose.Schema({
  kiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'Kiosk', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  creditUsed: { type: Number, default: 0 }, // amount funded via BNPL
  status: {
    type: String,
    enum: ['placed','approved','dispatched','delivered','repaid','overdue','cancelled'],
    default: 'placed'
  },
  placedAt: { type: Date, default: Date.now },
  dueDate: Date
});

module.exports = mongoose.model('Order', OrderSchema);
