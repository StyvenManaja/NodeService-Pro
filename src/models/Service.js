const mongoose = require('mongoose');

// Schéma pour les préstations
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

// Création du modèle de prestation
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
