const invoiceService = require('../services/invoice.service');

// Crée une facture à partir d'un devis
const createInvoice = async (req, res, next) => {
    const { devisId } = req.params;
    const { dueDate } = req.body;
    const userId = req.userId; // Récupération de l'ID utilisateur depuis le token JWT
    try {
        const invoice = await invoiceService.createInvoice(userId, devisId, dueDate);
        return res.status(201).json({
            status: 'success',
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

// Récuperer une facture par son ID
const getInvoiceById = async (req, res, next) => {
    const { invoiceId } = req.params;
    const userId = req.userId;
    try {
        const invoice = await invoiceService.getInvoiceById(userId, invoiceId);
        return res.status(200).json({
            status: 'success',
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

// Récuperer la liste de toutes les factures
const getAllInvoices = async (req, res, next) => {
    const userId = req.userId;
    try {
        const invoices = await invoiceService.getAllInvoices(userId);
        res.status(200).json({
            status: 'success',
            data: invoices
        });
    } catch (error) {
        next(error);
    }
}

// Payer une facture
const payInvoice = async (req, res, next) => {
    const { invoiceId } = req.params;
    const userId = req.userId;
    try {
        const invoice = await invoiceService.payInvoice(userId, invoiceId);
        return res.status(200).json({
            status: 'success',
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

// Générer un PDF pour une facture
const generateInvoicePDF = async (req, res, next) => {
    const { invoiceId } = req.params;
    const userId = req.userId;
    try {
        const pdf = await invoiceService.generateInvoicePDF(userId, invoiceId);
        res.status(201).json({
            status: 'success',
            data: { pdfUrl: pdf }
        });
    } catch (error) {
        next(error);
    }
}

// Envoyer une facture par email
const sendInvoiceByEmail = async (req, res, next) => {
    const { invoiceId } = req.params;
    const userId = req.userId;
    try {
        await invoiceService.sendInvoiceByEmail(userId, invoiceId);
        res.status(200).json({
            status: 'success',
            message: 'Invoice sent by email'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getInvoiceById,
    getAllInvoices,
    payInvoice,
    generateInvoicePDF,
    sendInvoiceByEmail
};
