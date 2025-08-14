const mongoose = require('mongoose');

// Schema mongoose pour les devis
const QuoteSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    prestations: [{
        prestation: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestation', required: true },
        quantity: { type: Number, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    validityPeriod: { type: Number, default: 30 }, // en jours
    pdfPath: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', QuoteSchema);