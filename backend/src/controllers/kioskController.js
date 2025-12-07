// src/controllers/kioskController.js
const asyncHandler = require('express-async-handler');
const Kiosk = require('../models/Kiosk'); // note: filename 'kiosk.js' in your models folder

// GET /api/kiosks/me
// return kiosk that belongs to the authenticated user
const getMyKiosk = asyncHandler(async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const kiosk = await Kiosk.findOne({ user: userId }).populate('user', 'email role');
  if (!kiosk) {
    res.status(404);
    throw new Error('Kiosk not found for this user');
  }

  res.json(kiosk);
});

// Create kiosk profile (onboarding) - logged-in kiosk user
const createKiosk = asyncHandler(async (req, res) => {
  const { kioskName, ownerName, phone, address, geo } = req.body;
  if (!kioskName || !ownerName || !phone) { res.status(400); throw new Error('Missing required fields'); }
  // One kiosk per user (MVP)
  const exists = await Kiosk.findOne({ user: req.user._id });
  if (exists) { res.status(400); throw new Error('Kiosk already exists for this user'); }
  const kiosk = await Kiosk.create({
    user: req.user._id, kioskName, ownerName, phone, address, geo
  });
  res.status(201).json(kiosk);
});

// Get kiosk by id
const getKiosk = asyncHandler(async (req, res) => {
  const kiosk = await Kiosk.findById(req.params.id).populate('user', 'email role');
  if (!kiosk) { res.status(404); throw new Error('Kiosk not found'); }
  res.json(kiosk);
});

// Update kiosk (owner or admin)
const updateKiosk = asyncHandler(async (req, res) => {
  const kiosk = await Kiosk.findById(req.params.id);
  if (!kiosk) { res.status(404); throw new Error('Kiosk not found'); }
  if (kiosk.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not allowed');
  }
  Object.assign(kiosk, req.body);
  const updated = await kiosk.save();
  res.json(updated);
});

// Delete kiosk (owner or admin)
const deleteKiosk = asyncHandler(async (req, res) => {
  const kiosk = await Kiosk.findById(req.params.id);
  if (!kiosk) { res.status(404); throw new Error('Kiosk not found'); }
  // only kiosk owner or admin can delete
  if (kiosk.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not allowed');
  }
  await kiosk.remove();
  res.json({ message: 'Kiosk deleted' });
});

// Admin: list kiosks
const listKiosks = asyncHandler(async (req, res) => {
  const kiosks = await Kiosk.find().populate('user', 'email');
  res.json(kiosks);
});

// Admin: adjust credit limit
const adjustCredit = asyncHandler(async (req, res) => {
  const kiosk = await Kiosk.findById(req.params.id);
  if (!kiosk) { res.status(404); throw new Error('Kiosk not found'); }
  const { creditLimit } = req.body;
  if (creditLimit == null) { res.status(400); throw new Error('creditLimit is required'); }
  kiosk.creditLimit = Number(creditLimit);
  await kiosk.save();
  res.json(kiosk);
});

module.exports = { 
  createKiosk, 
  getKiosk, 
  updateKiosk, 
  deleteKiosk,
  getMyKiosk,
  listKiosks, 
  adjustCredit 
};
