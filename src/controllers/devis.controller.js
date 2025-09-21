const devisService = require('../services/devis.service');

// Crée un devis
const createDevis = async (req, res, next) => {
    try {
        let { prestations, ...rest } = req.body;
        const userId = req.userId; // Récupération de l'ID utilisateur depuis le token JWT
        // Si prestations est un tableau de chaînes, transformer en objets
        if (Array.isArray(prestations) && prestations.length > 0 && typeof prestations[0] === 'string') {
            prestations = prestations.map(id => ({ prestation: id, quantity: 1 }));
        }
        const devis = await devisService.createDevis({ ...rest, prestations, user: userId });
        res.status(201).json({
            status: 'success',
            data: devis
        });
    } catch (error) {
        next(error);
    }
};

// Récuperer un devis par son ID
const getDevisById = async (req, res, next) => {
    const { devisId } = req.params;
    const userId = req.userId;
    try {
        const devis = await devisService.getDevisById(userId, devisId);
        res.status(200).json({
            status: 'success',
            data: devis
        });
    } catch (error) {
        next(error);
    }
};

// Récuperation de la liste de tous les devis
const getAllDevis = async (req, res, next) => {
    const userId = req.userId;
    try {
        const devis = await devisService.getAllDevis(userId);
        res.status(200).json({
            status: 'success',
            data: devis
        });
    } catch (error) {
        next(error);
    }
};

// Générer un PDF pour un devis
const generateDevisPDF = async (req, res, next) => {
    const { devisId } = req.params;
    const userId = req.userId;
    try {
        const pdf = await devisService.generateDevisPDF(userId, devisId);
        res.status(201).json({
            status: 'success',
            data: { pdfUrl: pdf }
        });
    } catch (error) {
        next(error);
    }
}

// Envoyer un devis par email
const sendDevisByEmail = async (req, res, next) => {
    const { devisId } = req.params;
    const userId = req.userId;
    try {
        await devisService.sendDevisByEmail(userId, devisId);
        res.status(200).json({
            status: 'success',
            message: 'Devis sent by email'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDevis,
    getDevisById,
    getAllDevis,
    sendDevisByEmail,
    generateDevisPDF
};