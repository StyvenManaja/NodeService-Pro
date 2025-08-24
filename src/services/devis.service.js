const devisRepository = require('../repositories/devis.repository');
const PDFGenerator = require('../utils/pdf.generator');
const mailSender = require('../utils/mail.sender');
const Prestation = require('../models/Prestations');

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
                totalAmount: devis.totalAmount,
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
                            <p style="margin-top:20px;">Merci pour votre confiance.<br>L'équipe Styven Manaja Digital</p>
                        </div>
                    `,
                    attachmentName: devis.id,
                    attachmentFolder: 'devis'
                });
            } catch (pdfError) {
                console.error('Erreur lors de la génération du PDF:', pdfError);
            }
            return devis;
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la création du devis:', error);
        throw new Error('Error creating devis');
    }
};

// Récuperer la liste de tous les devis
const getAllDevis = async (userId) => {
    try {
        return await devisRepository.getAllDevis(userId);
    } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        throw new Error('Error fetching quotes');
    }
}

module.exports = {
    createDevis,
    getAllDevis
};
