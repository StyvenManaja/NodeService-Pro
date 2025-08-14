const serviceRepository = require('../repositories/service.repository');

// Création d'une prestation
const createService = async (name, description, price) => {
    try {
        const serviceData = { name, description, price };
        return await serviceRepository.createService(serviceData);
    } catch (error) {
        throw new Error('Error creating service: ' + error.message);
    }
};

// Récuperation d'une prestation avec son ID
const getServiceById = async (serviceId) => {
    try {
        return await serviceRepository.getServiceById(serviceId);
    } catch (error) {
        throw new Error('Error fetching service: ' + error.message);
    }
};

// Récuperer la liste de toutes les prestations
const getAllServices = async () => {
    try {
        return await serviceRepository.getAllServices();
    } catch (error) {
        throw new Error('Error fetching services: ' + error.message);
    }
};

// Mise à jour d'une prestation
const updateService = async (serviceId, serviceData) => {
    try {
        return await serviceRepository.updateService(serviceId, serviceData);
    } catch (error) {
        throw new Error('Error updating service: ' + error.message);
    }
};

// Suppression d'une prestation
const deleteService = async (serviceId) => {
    try {
        return await serviceRepository.deleteService(serviceId);
    } catch (error) {
        throw new Error('Error deleting service: ' + error.message);
    }
};

module.exports = {
    createService,
    getServiceById,
    getAllServices,
    updateService,
    deleteService
};
