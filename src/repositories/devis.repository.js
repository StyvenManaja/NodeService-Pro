const Devis = require('../models/Devis');

// Crée un devis
const createDevis = async (devisData) => {
    try {
        const devis = new Devis(devisData);
        return await devis.save();
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Récupérer un devis par ID
const getDevisById = async (devisId) => {
    try {
        return await Devis.findById(devisId).populate('client').populate('prestations.prestation');
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Récuperer tous les devis
const getAllDevis = async (userId) => {
    try {
        return await Devis.find({ user: userId }).populate('client').populate('prestations.prestation');
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

module.exports = {
    createDevis,
    getDevisById,
    getAllDevis
};
