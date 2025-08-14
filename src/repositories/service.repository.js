const Service = require('../models/Service');

// Création d'une prestation
const createService = async (serviceData) => {
    try {
        const service = new Service(serviceData);
        return await service.save();
    } catch (error) {
        // Gestion des doublons MongoDB (code 11000)
        if (error.code === 11000) {
            throw new Error('Service already exists: ' + error.message);
        }
        // Gestion des autres erreurs de création
        throw new Error('Error on creating service: ' + error.message);
    }
};

// Récupération d'une prestation par ID
const getServiceById = async (serviceId) => {
    try {
        return await Service.findById(serviceId);
    } catch (error) {
        throw new Error('Error fetching service');
    }
};

// Récupération de la liste de toutes les prestations
const getAllServices = async () => {
    try {
        return await Service.find();
    } catch (error) {
        throw new Error('Error fetching services');
    }
};

// Mise à jour d'une prestation
const updateService = async (serviceId, serviceData) => {
    try {
        return await Service.findByIdAndUpdate(serviceId, serviceData, { new: true });
    } catch (error) {
        throw new Error('Error updating service');
    }
};

// Suppression d'une prestation
const deleteService = async (serviceId) => {
    try {
        return await Service.findByIdAndDelete(serviceId);
    } catch (error) {
        throw new Error('Error deleting service');
    }
};

module.exports = {
    createService,
    getServiceById,
    getAllServices,
    updateService,
    deleteService
};
