const mongoose = require('mongoose');

// Schema mongoose pour les factures
const invoiceSchema = new mongoose.Schema({
    devis: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis', required: true },
    status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
