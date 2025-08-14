const mongoose = require('mongoose');

// Définition du schéma client avec validation et contraintes
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    unique: true,
    match: /.+\@.+\..+/
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 15
  }
}, { timestamps: true });

// Création du modèle client
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
