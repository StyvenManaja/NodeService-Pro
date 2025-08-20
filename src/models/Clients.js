const mongoose = require('mongoose');

// Définition du schéma client avec validation et contraintes
const clientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  company: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15
  }
}, { timestamps: true });

// Unicité par utilisateur et nom
clientSchema.index({ user: 1, name: 1 }, { unique: true });
// Unicité par utilisateur et email
clientSchema.index({ user: 1, email: 1 }, { unique: true });
// Unicité par utilisateur et téléphone
clientSchema.index({ user: 1, phone: 1 }, { unique: true });

// Création du modèle client
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
