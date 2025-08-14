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
const getPrestationById = async (prestationId) => {
    try {
        return await Prestation.findById(prestationId);
    } catch (error) {
        throw new Error('Error fetching prestation: ' + error.message);
    }
};

// Récupération de la liste de toutes les prestations
const getAllPrestations = async () => {
    try {
        return await Prestation.find();
    } catch (error) {
        throw new Error('Error fetching prestations: ' + error.message);
    }
};

// Mise à jour d'une prestation
const updatePrestation = async (prestationId, prestationData) => {
    try {
        return await Prestation.findByIdAndUpdate(prestationId, prestationData, { new: true });
    } catch (error) {
        throw new Error('Error updating prestation: ' + error.message);
    }
};

// Suppression d'une prestation
const deletePrestation = async (prestationId) => {
    try {
        return await Prestation.findByIdAndDelete(prestationId);
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
