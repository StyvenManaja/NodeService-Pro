const invoiceRepository = require('../repositories/invoice.repository');
const PDFGenerator = require('../utils/pdf.generator');
const mailSender = require('../utils/mail.sender');

const fs = require('fs');
const path = require('path');

// Crée une facture à partir d'un devis
const createInvoice = async (devisId) => {
    try {
        const invoice = await invoiceRepository.createInvoice(devisId);
        if(invoice) {
            // Peupler le devis, puis le client et les prestations
            await invoice.populate({
                path: 'devis',
                populate: [
                    { path: 'client' },
                    { path: 'prestations.prestation' }
                ]
            });
            const devis = invoice.devis;

            // Création des données utiles pour la création de la facture en PDF
            const invoiceData = {
                client: {
                    name: devis.client.name,
                    email: devis.client.email,
                    company: devis.client.company,
                    phone: devis.client.phone
                },
                date: devis.createdAt,
                prestations: devis.prestations.map(p => ({
                    name: p.prestation.name,
                    description: p.prestation.description,
                    price: p.prestation.price,
                    quantity: p.quantity
                })),
                totalAmount: devis.totalAmount
            };

            // Vérifie que le dossier factures existe
            const invoicesDir = path.resolve('./invoices');
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir);
            }

            // Génération du PDF
            try {
                const pdfFileName = `invoice-${invoice._id}`;
                await PDFGenerator.createInvoice(invoiceData, path.join(invoicesDir, `${pdfFileName}.pdf`));
                await mailSender.sendMailWithAttachment(devis.client.email, pdfFileName, 'invoice');
            } catch (pdfError) {
                console.error('Erreur lors de la génération du PDF:', pdfError);
            }
            return invoice;
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la création de la facture:', error);
        throw new Error('Error creating invoice');
    }
};

// Récuperer toutes les factures
const getAllInvoices = async () => {
    try {
        return await invoiceRepository.getAllInvoices();
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        throw new Error('Error fetching invoices');
    }
};

module.exports = {
    createInvoice,
    getAllInvoices
};
