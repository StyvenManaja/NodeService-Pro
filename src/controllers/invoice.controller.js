const invoiceService = require('../services/invoice.service');

// Crée une facture à partir d'un devis
const createInvoice = async (req, res) => {
    const { devisId } = req.params;
    try {
        const invoice = await invoiceService.createInvoice(devisId);
        if(!invoice) {
            return res.status(400).json({ error: 'Erreur lors de la création de la facture.' });
        }
        return res.status(201).json(invoice);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Récuperer la liste de toutes les factures
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceService.getAllInvoices();
        if(!invoices || invoices.length === 0) {
            return res.status(404).json({ message: 'No invoices found' });
        }
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createInvoice,
    getAllInvoices
};
