const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const verificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification;
