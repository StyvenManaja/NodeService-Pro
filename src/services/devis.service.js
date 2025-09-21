const devisRepository = require('../repositories/devis.repository');
const PDFGenerator = require('../utils/pdf.generator');
const mailSender = require('../utils/mail.sender');
const Prestation = require('../models/Prestations');
const AppError = require('../utils/AppError');

// Crée un devis
const fs = require('fs');
const path = require('path');

const createDevis = async (devisData) => {
    try {
        // On récupère les prestations et calcule le total
        let prestationsInput = devisData.prestations;
        // Si tableau d'IDs, transformer en objets { prestation, quantity }
        if (Array.isArray(prestationsInput) && prestationsInput.length > 0 && typeof prestationsInput[0] === 'string') {
            prestationsInput = prestationsInput.map(id => ({ prestation: id, quantity: 1 }));
        }

        // Récupérer toutes les prestations depuis la base
        const prestationIds = prestationsInput.map(p => p.prestation);
        const prestationsFromDb = await Prestation.find({ _id: { $in: prestationIds } });

        // Calculer le total
        let totalAmount = 0;
        const prestationsFinal = prestationsInput.map(p => {
            const prestationDb = prestationsFromDb.find(dbP => dbP._id.toString() === p.prestation);
            const price = prestationDb ? prestationDb.price : 0;
            totalAmount += price * (p.quantity || 1);
            return {
                prestation: p.prestation,
                quantity: p.quantity || 1
            };
        });

        // Créer le devis avec le total calculé
        const devisToCreate = {
            ...devisData,
            prestations: prestationsFinal,
            totalAmount
        };

        let devis = await devisRepository.createDevis(devisToCreate);
        if(!devis) {
            throw new AppError('Devis not created', 400);
        }
        return devis;
    } catch (error) {
        throw new AppError('Error on creating devis', 500);
    }
};

// Récuperer un devis par son ID
const getDevisById = async (userId, devisId) => {
    try {
        const devis = await devisRepository.getDevis(userId, devisId);
        if (!devis) {
            throw new AppError('Devis not found', 404);
        }
        return devis;
    } catch (error) {
        throw new AppError('Error finding devis', 500);
    }
};

// Récuperer la liste de tous les devis
const getAllDevis = async (userId) => {
    try {
        const devis = await devisRepository.getAllDevis(userId);
        if (!devis) {
            throw new AppError('No devis found', 404);
        }
        return devis;
    } catch (error) {
        throw new AppError('Error on finding all devis', 500);
    }
}

// Générer un PDF pour un devis
const generateDevisPDF = async (userId, devisId) => {
    try {
        const devis = await devisRepository.getDevis(userId, devisId);
        if (!devis) {
            throw new AppError('Devis not found', 404);
        }

        // Population des données client, prestations et users
        await devis.populate('client');
        await devis.populate('prestations.prestation');
        await devis.populate('user');

        // Vérification de l'existence du client
        if (!devis.client) {
            throw new AppError('Client not found', 404);
        }

        // Génération des lignes du tableau prestations pour le template HTML
                const prestationsRows = devis.prestations.map(p =>
                    `<tr>
                        <td>
                            <div>${p.prestation.name}</div>
                            ${p.prestation.description ? `<div style="color:#666;font-size:11px;">${p.prestation.description}</div>` : ''}
                        </td>
                        <td class="right">${p.prestation.price} €</td>
                        <td class="right">${p.quantity}</td>
                        <td class="right">${p.prestation.price * p.quantity} €</td>
                    </tr>`
                ).join('');

        // Préparation des données pour le PDF
        const devisData = {
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
            prestations: devis.prestations.map(p => ({
                name: p.prestation.name,
                description: p.prestation.description,
                price: p.prestation.price,
                quantity: p.quantity
            })),
            prestationsRows,
            totalAmount: devis.totalAmount,
            subTotal: (devis.totalAmount / 1.2).toFixed(2),
            tva: (devis.totalAmount - devis.totalAmount / 1.2).toFixed(2),
            validityPeriod: devis.validityPeriod,
            date: devis.createdAt
        };

        try {
            const pdfBuffer = await PDFGenerator.createDevis(devisData);
            return pdfBuffer;
        } catch (pdfError) {
            throw new AppError('Error on generating devis PDF', 500);
        }
    } catch (error) {
        throw new AppError('Unexpected error on generating devis PDF', 500);
    }
};

// Envoi du mail avec le PDF en pièce jointe
const sendDevisByEmail = async (userId, devisId) => {
    try {
        const devis = await devisRepository.getDevis(userId, devisId);
        if (!devis) {
            throw new AppError('Devis not found', 404);
        }

        // Population des données client, prestations et users
        await devis.populate('client');
        await devis.populate('prestations.prestation');
        await devis.populate('user');

        // Vérification de l'existence du client
        if (!devis.client) {
            throw new AppError('Client not found', 404);
        }

        // Génération du PDF
        let pdfBuffer;
        try {
            pdfBuffer = await generateDevisPDF(userId, devisId);
        } catch (pdfError) {
            throw new AppError('Error on generating devis PDF', 500);
        }

        // Préparation des données pour l'email et envoi
        await mailSender.sendMail({
            to: devis.client.email,
            subject: 'Votre devis',
            templateName: 'devis',
            templateVars: {
                clientName: devis.client.name
            },
            attachments: [
                {
                    filename: `devis-${devis._id}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });
    } catch (error) {
        throw new AppError('Unexpected error on sending devis email', 500);
    }
};

module.exports = {
    createDevis,
    getDevisById,
    getAllDevis,
    sendDevisByEmail,
    generateDevisPDF
};
