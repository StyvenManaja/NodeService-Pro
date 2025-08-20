const devisService = require('../services/devis.service');

// Crée un devis
const createDevis = async (req, res) => {
    try {
        let { prestations, ...rest } = req.body;
        const userId = req.userId; // Récupération de l'ID utilisateur depuis le token JWT
        // Si prestations est un tableau de chaînes, transformer en objets
        if (Array.isArray(prestations) && prestations.length > 0 && typeof prestations[0] === 'string') {
            prestations = prestations.map(id => ({ prestation: id, quantity: 1 }));
        }
        const devis = await devisService.createDevis({ ...rest, prestations, user: userId });
        if(!devis) {
            return res.status(400).json({ message: 'Error creating devis' });
        }
        res.status(201).json(devis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récuperation de la liste de tous les devis
const getAllDevis = async (req, res) => {
    const userId = req.userId; // Récupération de l'ID utilisateur depuis le token JWT
    try {
        const devis = await devisService.getAllDevis(userId);
        if(!devis || devis.length === 0) {
            return res.status(404).json({ message: 'No devis found' });
        }
        res.status(200).json(devis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDevis,
    getAllDevis
};
