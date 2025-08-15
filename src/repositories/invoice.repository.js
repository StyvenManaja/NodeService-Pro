const Invoice = require('../models/Invoices');

// Crée une facture
const createInvoice = async (devisId) => {
    try {
        const invoice = new Invoice({ devis: devisId });
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

module.exports = {
    createInvoice,
    getAllInvoices
};
