const Invoice = require('../models/Invoices');

// Crée une facture
const createInvoice = async (userId, devisId, dueDate) => {
    try {
        const invoice = new Invoice({ user: userId, devis: devisId, dueDate });
        await invoice.save();
        return invoice;
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Récuperation d'une facture par ID
const getInvoiceById = async (userId, invoiceId) => {
    try {
        const invoice = await Invoice.findOne({ user: userId, _id: invoiceId }).populate('devis');
        if(invoice) {
            await invoice.populate({ path: 'devis', populate: { path: 'prestations.prestation' } });
        }
        return invoice;
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Récuperer toutes les factures
const getAllInvoices = async (userId) => {
    try {
        return await Invoice.find({ user: userId }).populate('devis');
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Payer une facture
const payInvoice = async (userId, invoiceId) => {
    try {
        return await Invoice.findOneAndUpdate({ _id: invoiceId, user: userId }, { status: 'paid' }, { new: true });
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

module.exports = {
    createInvoice,
    getInvoiceById,
    getAllInvoices,
    payInvoice
};
