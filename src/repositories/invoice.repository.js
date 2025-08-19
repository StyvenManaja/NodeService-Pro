const Invoice = require('../models/Invoices');

// Crée une facture
const createInvoice = async (devisId, dueDate) => {
    try {
        const invoice = new Invoice({ devis: devisId, dueDate });
        await invoice.save();
        return invoice;
    } catch (error) {
        console.error('Erreur lors de la création de la facture:', error);
        throw new Error('Error creating invoice');
    }
};

// Récuperer toutes les factures
const getAllInvoices = async () => {
    try {
        return await Invoice.find().populate('devis');
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        throw new Error('Error fetching invoices');
    }
};

// Payer une facture
const payInvoice = async (invoiceId) => {
    try {
        const paid = await Invoice.findByIdAndUpdate(invoiceId, { status: 'paid' }, { new: true });
        return paid;
    } catch (error) {
        console.error('Erreur lors du paiement de la facture:', error);
        throw new Error('Error paying invoice');
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    payInvoice
};
