const prestationRepository = require('../repositories/prestation.repository');
const AppError = require('../utils/AppError');

// Création d'une prestation
const createPrestation = async (userId, name, description, price) => {
    try {
        const prestation = await prestationRepository.createPrestation({ user: userId, name, description, price });
        if(!prestation) {
            throw new AppError('Can not create prestation', 400);
        }
        return prestation;
    } catch (error) {
        if (error.message.startsWith('DUPLICATE_')) {
            const field = error.message.replace('DUPLICATE_', '').toLowerCase();
            throw new AppError(`Prestation ${field} already exists`, 409);
        }
        throw new AppError('Error on creating prestation', 500);
    }
};

// Récuperation d'une prestation avec son ID
const getPrestationById = async (userId, prestationId) => {
    try {
        const prestation = await prestationRepository.getPrestationById(userId, prestationId);
        if (!prestation) {
            throw new AppError('Prestation not found', 404);
        }
        return prestation;
    } catch (error) {
        throw new AppError('Error on getting the prestation', 500);
    }
};

// Récuperer la liste de toutes les prestations
const getAllPrestations = async (userId) => {
    try {
        const prestations = await prestationRepository.getAllPrestaions(userId);
        if(prestations.length === 0 || !prestations) {
            throw new AppError('No prestations found', 404);
        }
        return prestations;
    } catch (error) {
        throw new AppError('Error on getting prestations', 500);
    }
};

// Mise à jour d'une prestation
const updatePrestation = async (userId, prestationId, prestationData) => {
    try {
        const updatedPrestation = await prestationRepository.updatePrestation(userId, prestationId, prestationData);
        if (!updatedPrestation) {
            throw new AppError('Prestation not found', 404);
        }
        return updatedPrestation;
    } catch (error) {
        throw new AppError('Error on updating the prestation', 500);
    }
};

// Suppression d'une prestation
const deletePrestation = async (userId, prestationId) => {
    try {
        const deletedPrestation = await prestationRepository.deletePrestation(userId, prestationId);
        if (!deletedPrestation) {
            throw new AppError('Prestation not found', 404);
        }
        return deletedPrestation;
    } catch (error) {
        throw new AppError('Error on deleting prestation', 500);
    }
};

module.exports = {
    createPrestation,
    getPrestationById,
    getAllPrestations,
    updatePrestation,
    deletePrestation
};
