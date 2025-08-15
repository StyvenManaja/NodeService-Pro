const quoteRepository = require('../repositories/quote.repository');
const PDFGenerator = require('../utils/pdf.generator');
const Prestation = require('../models/Prestations');

// Crée un devis
const fs = require('fs');
const path = require('path');

const createQuote = async (quoteData) => {
    try {
        // On récupère les prestations et calcule le total
        let prestationsInput = quoteData.prestations;
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
        const quoteToCreate = {
            ...quoteData,
            prestations: prestationsFinal,
            totalAmount
        };

        let quote = await quoteRepository.createQuote(quoteToCreate);
        if(quote) {
            // Population des données client et prestations
            quote = await quote.populate('client');
            quote = await quote.populate('prestations.prestation');

            // Préparation des données pour le PDF
            const devisData = {
                client: {
                    name: quote.client.name,
                    email: quote.client.email,
                    company: quote.client.company,
                    phone: quote.client.phone
                },
                prestations: quote.prestations.map(p => ({
                    name: p.prestation.name,
                    description: p.prestation.description,
                    price: p.prestation.price,
                    quantity: p.quantity
                })),
                totalAmount: quote.totalAmount,
                validityPeriod: quote.validityPeriod,
                date: quote.createdAt
            };

            // Vérifie que le dossier devis existe
            const devisDir = path.resolve('./devis');
            if (!fs.existsSync(devisDir)) {
                fs.mkdirSync(devisDir);
            }
            try {
                await PDFGenerator.createDevis(devisData, path.join(devisDir, `${quote.id}.pdf`));
            } catch (pdfError) {
                console.error('Erreur lors de la génération du PDF:', pdfError);
            }
            return quote;
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la création du devis:', error);
        throw new Error('Error creating quote');
    }
};

module.exports = {
    createQuote
};
