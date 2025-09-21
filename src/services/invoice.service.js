const invoiceRepository = require('../repositories/invoice.repository');
const PDFGenerator = require('../utils/pdf.generator');
const mailSender = require('../utils/mail.sender');
const AppError = require('../utils/AppError');

const fs = require('fs');
const path = require('path');

// Crée une facture à partir d'un devis
const createInvoice = async (userId, devisId, dueDate) => {
    try {
        const invoice = await invoiceRepository.createInvoice(userId, devisId, dueDate);
        if(!invoice) {
            throw new AppError('Can not create invoice', 400);
        }
        return invoice;
    } catch (error) {
        throw new AppError('Error creating invoice', 500);
    }
};

// Récuperer un facture par son ID
const getInvoiceById = async (userId, invoiceId) => {
    try {
        const invoice = await invoiceRepository.getInvoiceById(userId, invoiceId);
        if (!invoice) {
            throw new AppError('Invoice not found', 404);
        }
        return invoice;
    } catch (error) {
        throw new AppError('Error getting the invoice', 500);
    }
};

// Récuperer toutes les factures
const getAllInvoices = async (userId) => {
    try {
        const invoices = await invoiceRepository.getAllInvoices(userId);
        if(invoices.length === 0 || !invoices ) {
            throw new AppError('No invoices found', 404);
        }
        return invoices;
    } catch (error) {
        throw new AppError('Error getting all invoices', 500);
    }
};

// Payer une facture
const payInvoice = async (userId, invoiceId) => {
    try {
        const invoice = await invoiceRepository.payInvoice(userId, invoiceId);
        if(invoice) {
            await invoice.populate({
                path: 'devis',
                populate: [
                    { path: 'client' }
                ]
            });
            await mailSender.sendMail({
                to: invoice.devis.client.email,
                subject: 'Confirmation de paiement',
                templateName: 'payment',
                templateVars: {
                    clientName: invoice.devis.client.name
                },
                attachmentName: `invoice-${invoice._id}`,
                attachmentFolder: 'invoices'
            });
            return invoice;
        }
        throw new AppError('Can not pay the invoice', 400);
    } catch (error) {
        throw new AppError('Error on paying the invoice', 500);
    }
};

// Générer un PDF pour une facture
const generateInvoicePDF = async (userId, invoiceId) => {
    try {
        const invoice = await invoiceRepository.getInvoiceById(userId, invoiceId);
        if (!invoice) {
            throw new AppError('Invoice not found', 404);
        }

        // Peupler le devis, puis le client, les prestations et l'utilisateur
        await invoice.populate({
            path: 'devis',
            populate: [
                { path: 'client' },
                { path: 'prestations.prestation' },
                { path: 'user' }
            ]
        });
        const devis = invoice.devis;

        // Génération des lignes du tableau prestations pour le template HTML
        const prestationsRows = devis.prestations.map(p =>
          `<tr>
            <td>${p.prestation.name}</td>
            <td class="right">${p.prestation.price} €</td>
            <td class="right">${p.quantity}</td>
            <td class="right">${p.prestation.price * p.quantity} €</td>
          </tr>`
        ).join('');

        // Création des données utiles pour la création de la facture en PDF
        const invoiceData = {
            user: {
                name: devis.user.lastname,
                email: devis.user.email,
                phone: devis.user.phone || '',
                company: devis.user.company || ''
            },
            client: {
                name: devis.client.name,
                email: devis.client.email,
                company: devis.client.company || '',
                phone: devis.client.phone || ''
            },
            date: devis.createdAt,
            prestationsRows,
            totalAmount: devis.totalAmount,
            subTotal: (devis.totalAmount / 1.2).toFixed(2),
            tva: (devis.totalAmount - devis.totalAmount / 1.2).toFixed(2),
            number: String(invoice._id).slice(-8)
        };

        // Génération du PDF
        try {
            const pdfBuffer = await PDFGenerator.createInvoice(invoiceData);
            return pdfBuffer;
        } catch (pdfError) {
            throw new AppError('Can not generate pdf', 500);
        }
    } catch (error) {
        throw new AppError('Error generating invoice PDF', 500);
    }
};

// Envoyer une facture par email
const sendInvoiceByEmail = async (userId, invoiceId) => {
    try {
        const invoice = await invoiceRepository.getInvoiceById(userId, invoiceId);
        if(!invoice) {
            throw new AppError('Invoice not found', 404);
        }

        await invoice.populate({
            path: 'devis',
            populate: [
                { path: 'client' },
                { path: 'prestations.prestation' },
                { path: 'user' }
            ]
        });

        // Génération du PDF
        let pdfBuffer;
        try {
            pdfBuffer = await generateInvoicePDF(userId, invoiceId);
        } catch (pdfError) {
            throw new AppError('Error on generating invoice PDF', 500);
        }

        // Préparation des données pour l'email et envoi
        await mailSender.sendMail({
            to: invoice.devis.client.email,
            subject: 'Votre facture',
            templateName: 'invoice',
            templateVars: {
                clientName: invoice.devis.client.name
            },
            attachments: [
                {
                    filename: `invoice-${invoice._id}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });
        return invoice;
    } catch(error) {
        throw new AppError('Error sending invoice by email', 500);
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
