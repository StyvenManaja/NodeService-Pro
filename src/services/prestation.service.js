const prestationRepository = require('../repositories/prestation.repository');

// Création d'une prestation
const createPrestation = async (userId, name, description, price) => {
    try {
        const prestationData = { userId, name, description, price };
        return await prestationRepository.createPrestation(prestationData);
    } catch (error) {
        throw new Error('Error creating prestation: ' + error.message);
    }
};

// Récuperation d'une prestation avec son ID
const getPrestationById = async (userId, prestationId) => {
    try {
        return await prestationRepository.getPrestationById(userId, prestationId);
    } catch (error) {
        throw new Error('Error fetching prestation: ' + error.message);
    }
};

// Récuperer la liste de toutes les prestations
const getAllPrestations = async (userId) => {
    try {
        return await prestationRepository.getAllPrestations(userId);
    } catch (error) {
        throw new Error('Error fetching prestations: ' + error.message);
    }
};

// Mise à jour d'une prestation
const updatePrestation = async (userId, prestationId, prestationData) => {
    try {
        return await prestationRepository.updatePrestation(userId, prestationId, prestationData);
    } catch (error) {
        throw new Error('Error updating prestation: ' + error.message);
    }
};

// Suppression d'une prestation
const deletePrestation = async (userId, prestationId) => {
    try {
        return await prestationRepository.deletePrestation(userId, prestationId);
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
