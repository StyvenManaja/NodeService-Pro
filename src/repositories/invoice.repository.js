const Invoice = require('../models/Invoices');

// Crée une facture
const createInvoice = async (userId, devisId, dueDate) => {
    try {
        const invoice = new Invoice({ user: userId, devis: devisId, dueDate });
        await invoice.save();
        return invoice;
    } catch (error) {
        console.error('Erreur lors de la création de la facture:', error);
        throw new Error('Error creating invoice');
    }
};

// Récuperer toutes les factures
const getAllInvoices = async (userId) => {
    try {
        return await Invoice.find({ user: userId }).populate('devis');
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        throw new Error('Error fetching invoices');
    }
};

// Payer une facture
const payInvoice = async (userId, invoiceId) => {
    try {
        const paid = await Invoice.findOneAndUpdate({ _id: invoiceId, user: userId }, { status: 'paid' }, { new: true });
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
