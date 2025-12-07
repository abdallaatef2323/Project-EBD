// src/utils/seed.js
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Kiosk = require('../models/Kiosk');
const Product = require('../models/product');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    await User.deleteMany();
    await Kiosk.deleteMany();
    await Product.deleteMany();

    const admin = await User.create({ email: 'admin@tamwilna.local', password: 'password', role: 'admin' });
    const kioskUser = await User.create({ email: 'kiosk1@tamwilna.local', password: 'password', role: 'kiosk' });

    const kiosk = await Kiosk.create({
  user: kioskUser._id,
  kioskName: 'Kiosk One',
  ownerName: 'Ibrahim',
  phone: '0123456789',
  address: 'Cairo',
  // geo must include coordinates [lng, lat]
  geo: { type: 'Point', coordinates: [31.2357, 30.0444] }, // example: Cairo (lng, lat)
  creditLimit: 1000,
  outstandingBalance: 100
});

    await Product.create([
      { sku: 'P001', name: 'Cigarettes Pack', price: 40, category: 'tobacco', availableQuantity: 100 },
      { sku: 'P002', name: 'Bottled Water 500ml', price: 10, category: 'beverages', availableQuantity: 200 },
      { sku: 'P003', name: 'Snack Chips', price: 8, category: 'snacks', availableQuantity: 150 }
    ]);

    console.log('Seed complete. Admin credentials: admin@tamwilna.local / password  - Kiosk: kiosk1@tamwilna.local / password');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
