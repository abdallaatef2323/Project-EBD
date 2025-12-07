
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  kiosk: { type: mongoose.Schema.Types.ObjectId, ref: 'Kiosk', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['disbursement','repayment','adjustment'], required: true },
  method: { type: String, enum: ['bank','cash','mobile_money','wallet'], default: 'cash' },
  createdAt: { type: Date, default: Date.now },
  note: String
});

module.exports = mongoose.model('Transaction', TransactionSchema);
