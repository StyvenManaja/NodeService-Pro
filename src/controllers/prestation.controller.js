const prestationService = require('../services/prestation.service');

// Créer une prestation
const createPrestation = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newPrestation = await prestationService.createPrestation(name, description, price);
        if(!newPrestation) {
            return res.status(400).json({ error: 'Error creating prestation' });
        }
        res.status(201).json(newPrestation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récuperer une prestation avec son ID
const getPrestationById = async (req, res) => {
    const { prestationID } = req.params;
    try {
        const prestation = await prestationService.getPrestationById(prestationID);
        if(!prestation) {
            return res.status(404).json({ error: 'Prestation not found' });
        }
        res.status(200).json(prestation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récuperer la liste de toutes les prestations
const getAllPrestations = async (req, res) => {
    try {
        const prestations = await prestationService.getAllPrestations();
        if(!prestations || prestations.length === 0) {
            return res.status(404).json({ error: 'No prestations found' });
        }
        res.status(200).json(prestations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jours les données d'une prestation
const updatePrestation = async (req, res) => {
    const { prestationID } = req.params;
    const prestationData = req.body;
    try {
        const updatedPrestation = await prestationService.updatePrestation(prestationID, prestationData);
        if (!updatedPrestation) {
            return res.status(404).json({ error: 'Prestation not found' });
        }
        res.status(200).json(updatedPrestation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une prestation
const deletePrestation = async (req, res) => {
    const { prestationID } = req.params;
    try {
        const deletedPrestation = await prestationService.deletePrestation(prestationID);
        if (!deletedPrestation) {
            return res.status(404).json({ error: 'Prestation not found' });
        }
        res.status(204).json({ message: 'Prestation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPrestation,
    getPrestationById,
    getAllPrestations,
    updatePrestation,
    deletePrestation
};
