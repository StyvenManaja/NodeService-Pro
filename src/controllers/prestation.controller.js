const prestationService = require('../services/prestation.service');

// Créer une prestation
const createPrestation = async (req, res, next) => {
    const { name, description, price } = req.body;
    const userId = req.userId;
    try {
        const newPrestation = await prestationService.createPrestation(userId, name, description, price);
        res.status(201).json({
            status: 'success',
            data: newPrestation
        });
    } catch (error) {
        next(error);
    }
};

// Récuperer une prestation avec son ID
const getPrestationById = async (req, res, next) => {
    const { prestationID } = req.params;
    const userId = req.userId;
    try {
        const prestation = await prestationService.getPrestationById(userId, prestationID);
        res.status(200).json({
            status: 'success',
            data: prestation
        });
    } catch (error) {
        next(error);
    }
};

// Récuperer la liste de toutes les prestations
const getAllPrestations = async (req, res, next) => {
    const userId = req.userId;
    try {
        const prestations = await prestationService.getAllPrestations(userId);
        res.status(200).json({
            status: 'success',
            data: prestations
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jours les données d'une prestation
const updatePrestation = async (req, res, next) => {
    const { prestationID } = req.params;
    const prestationData = req.body;
    const userId = req.userId;
    try {
        const updatedPrestation = await prestationService.updatePrestation(userId, prestationID, prestationData);
        res.status(200).json({
            status: 'success',
            data: updatedPrestation
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer une prestation
const deletePrestation = async (req, res, next) => {
    const { prestationID } = req.params;
    const userId = req.userId;
    try {
        const deletedPrestation = await prestationService.deletePrestation(userId, prestationID);
        res.status(204).json({
            status: 'success',
            data: deletedPrestation
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPrestation,
    getPrestationById,
    getAllPrestations,
    updatePrestation,
    deletePrestation
};
