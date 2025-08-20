const Prestation = require('../models/Prestations');

// Création d'une prestation
const createPrestation = async (prestationData) => {
    try {
        const prestation = new Prestation(prestationData);
        return await prestation.save();
    } catch (error) {
        // Gestion des doublons MongoDB (code 11000)
        if (error.code === 11000) {
            throw new Error('Prestation already exists: ' + error.message);
        }
        // Gestion des autres erreurs de création
        throw new Error('Error on creating prestation: ' + error.message);
    }
};

// Récupération d'une prestation par ID
const getPrestationById = async (userId, prestationId) => {
    try {
        return await Prestation.findOne({ user: userId, _id: prestationId });
    } catch (error) {
        throw new Error('Error fetching prestation: ' + error.message);
    }
};

// Récupération de la liste de toutes les prestations
const getAllPrestations = async (userId) => {
    try {
        return await Prestation.find({ user: userId });
    } catch (error) {
        throw new Error('Error fetching prestations: ' + error.message);
    }
};

// Mise à jour d'une prestation
const updatePrestation = async (userId, prestationId, prestationData) => {
    try {
        return await Prestation.findOneAndUpdate({user: userId, _id: prestationId}, prestationData, { new: true });
    } catch (error) {
        throw new Error('Error updating prestation: ' + error.message);
    }
};

// Suppression d'une prestation
const deletePrestation = async (userId, prestationId) => {
    try {
        return await Prestation.findOneAndDelete({ user: userId, _id: prestationId});
    } catch (error) {
        throw new Error('Error deleting prestation: ' + error.message);
    }
};

module.exports = {
    createPrestation,
    getPrestationById,
    getAllPrestations,
    updatePrestation,
    deletePrestation
};
