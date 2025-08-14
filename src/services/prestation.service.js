const prestationRepository = require('../repositories/prestation.repository');

// Création d'une prestation
const createPrestation = async (name, description, price) => {
    try {
        const prestationData = { name, description, price };
        return await prestationRepository.createPrestation(prestationData);
    } catch (error) {
        throw new Error('Error creating prestation: ' + error.message);
    }
};

// Récuperation d'une prestation avec son ID
const getPrestationById = async (prestationId) => {
    try {
        return await prestationRepository.getPrestationById(prestationId);
    } catch (error) {
        throw new Error('Error fetching prestation: ' + error.message);
    }
};

// Récuperer la liste de toutes les prestations
const getAllPrestations = async () => {
    try {
        return await prestationRepository.getAllPrestations();
    } catch (error) {
        throw new Error('Error fetching prestations: ' + error.message);
    }
};

// Mise à jour d'une prestation
const updatePrestation = async (prestationId, prestationData) => {
    try {
        return await prestationRepository.updatePrestation(prestationId, prestationData);
    } catch (error) {
        throw new Error('Error updating prestation: ' + error.message);
    }
};

// Suppression d'une prestation
const deletePrestation = async (prestationId) => {
    try {
        return await prestationRepository.deletePrestation(prestationId);
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
