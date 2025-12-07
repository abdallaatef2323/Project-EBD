// src/app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const kioskRoutes = require('./routes/kioskRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// register routes
app.use('/api/auth', authRoutes);
app.use('/api/kiosks', kioskRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// health
app.get('/', (req, res) => res.send('Tamwilna API running'));

app.use(errorHandler);

module.exports = app;
