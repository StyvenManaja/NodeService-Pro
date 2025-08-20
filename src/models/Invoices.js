const mongoose = require('mongoose');

// Schema mongoose pour les factures
const invoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    devis: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis', required: true },
    status: { type: String, enum: ['paid', 'unpaid', 'overdue'], default: 'unpaid' },
    dueDate: { type: Date, required: true },
    // Suivi des relances
    reminder: {
        count: { type: Number, default: 0 },
        lastSent: { type: Date },
        scheduleDay: { type: [Number], default: [0, 3, 7, 14] }
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
