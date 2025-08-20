const mongoose = require('mongoose');

// Schéma pour les prestations
const prestationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// Unicité par utilisateur et nom
prestationSchema.index({ user: 1, name: 1 }, { unique: true });

const Prestation = mongoose.model('Prestation', prestationSchema);
module.exports = Prestation;
