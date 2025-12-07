// src/models/Kiosk.js
const mongoose = require('mongoose');

const KioskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner account
  kioskName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  geo: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined } // [lng, lat]
  },
  creditLimit: { type: Number, default: 0 },        // approved credit
  outstandingBalance: { type: Number, default: 0 }, // amount owed
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

KioskSchema.index({ geo: '2dsphere' });

// Avoid OverwriteModelError in development/reloads
const modelName = 'Kiosk';
module.exports = mongoose.models[modelName] || mongoose.model(modelName, KioskSchema);
