const invoiceRepository = require('../repositories/invoice.repository');
const PDFGenerator = require('../utils/pdf.generator');
const mailSender = require('../utils/mail.sender');

const fs = require('fs');
const path = require('path');

// Crée une facture à partir d'un devis
const createInvoice = async (userId, devisId, dueDate) => {
    try {
        const invoice = await invoiceRepository.createInvoice(userId, devisId, dueDate);
        if(invoice) {
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

            // Création des données utiles pour la création de la facture en PDF
            const invoiceData = {
                user: {
                    name: devis.user.lastname,
                    email: devis.user.email
                },
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
                await mailSender.sendMail({
                    to: devis.client.email,
                    subject: 'Votre facture',
                    text: 'Bonjour, voici votre facture en pièce jointe.',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #222;">
                            <h2 style="color: #007bff;">Votre facture</h2>
                            <p>Bonjour,</p>
                            <p>Veuillez trouver votre facture en pièce jointe.</p>
                            <p style="margin-top:20px;">Merci pour votre confiance.<br>L'équipe Styven Manaja Digital</p>
                        </div>
                    `,
                    attachmentName: pdfFileName,
                    attachmentFolder: 'invoices'
                });
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
const getAllInvoices = async (userId) => {
    try {
        return await invoiceRepository.getAllInvoices(userId);
    } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
        throw new Error('Error fetching invoices');
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
                text: 'Bonjour, votre paiement a bien été reçu.',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #222;">
                        <h2 style="color: #28a745;">Confirmation de paiement</h2>
                        <p>Bonjour,</p>
                        <p>Nous avons bien reçu votre paiement. Merci !</p>
                        <p style="margin-top:20px;">L'équipe Styven Manaja Digital</p>
                    </div>
                `,
                attachmentName: `invoice-${invoice._id}`,
                attachmentFolder: 'invoices'
            });
            return invoice;
        }
        return null;
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
