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
        if(devis) {
            // Population des données client, prestations et users
            devis = await devis.populate('client');
            devis = await devis.populate('prestations.prestation');
            devis = await devis.populate('user');

            // Vérification de l'existence du client
            if (!devis.client) {
                throw new Error('Client not found');
            }

            // Génération des lignes du tableau prestations pour le template HTML
            const prestationsRows = devis.prestations.map(p =>
              `<tr>
                <td>${p.prestation.name}</td>
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

            // Vérifie que le dossier devis existe
            const devisDir = path.resolve('./devis');
            if (!fs.existsSync(devisDir)) {
                fs.mkdirSync(devisDir);
            }
            try {
                await PDFGenerator.createDevis(devisData, path.join(devisDir, `${devis.id}.pdf`));
                await mailSender.sendMail({
                    to: devis.client.email,
                    subject: 'Votre devis',
                    text: 'Bonjour, voici votre devis en pièce jointe.',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #222;">
                            <h2 style="color: #007bff;">Votre devis</h2>
                            <p>Bonjour,</p>
                            <p>Veuillez trouver votre devis en pièce jointe.</p>
                            <p style="margin-top:20px;">Merci pour votre confiance.<br>L'équipe Organivo</p>
                        </div>
                    `,
                    attachmentName: devis.id,
                    attachmentFolder: 'devis'
                });
            } catch (pdfError) {
                throw new AppError('Error on generating pdf', 500);
            }
            return devis;
        }
        throw new AppError('Can not create devis', 400);
    } catch (error) {
        throw new AppError('Error on creating devis', 500);
    }
};

// Récuperer un devis par son ID
const getDevisById = async (userId, devisId) => {
    try {
        const devis = await devisRepository.getDevisById(devisId);
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

module.exports = {
    createDevis,
    getDevisById,
    getAllDevis
};
