const Devis = require('../models/Devis');

// Crée un devis
const createDevis = async (devisData) => {
    try {
        const devis = new Devis(devisData);
        return await devis.save();
    } catch (error) {
        throw new Error('Error creating devis');
    }
};

// Récuperer tous les devis
const getAllDevis = async (userId) => {
    try {
        return await Devis.find({ user: userId }).populate('client').populate('prestations.prestation');
    } catch (error) {
        throw new Error('Error fetching devis');
    }
};

module.exports = {
    createDevis,
    getAllDevis
};
