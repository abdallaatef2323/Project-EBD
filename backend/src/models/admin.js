const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true
    },

    department: {
      type: String,
      default: 'Operations'
    },

    permissions: {
      type: [String],
      default: [
        'MANAGE_KIOSKS',
        'APPROVE_ORDERS',
        'VIEW_ANALYTICS'
      ]
    },

    isSuperAdmin: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', AdminSchema);
