const serviceService = require('../services/service.service');

// Créer une prestation
const createService = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newService = await serviceService.createService(name, description, price);
        if(!newService) {
            return res.status(400).json({ error: 'Error creating service' });
        }
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récuperer une prestation avec son ID
const getServiceById = async (req, res) => {
    const { serviceID } = req.params;
    try {
        const service = await serviceService.getServiceById(serviceID);
        if(!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Récuperer la liste de toutes les prestations
const getAllServices = async (req, res) => {
    try {
        const services = await serviceService.getAllServices();
        if(!services || services.length === 0) {
            return res.status(404).json({ error: 'No services found' });
        }
        res.status(200).json(services);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Mettre à jours les données d'une prestation
const updateService = async (req, res) => {
    const { serviceID } = req.params;
    const serviceData = req.body;
    try {
        const updatedService = await serviceService.updateService(serviceID, serviceData);
        if (!updatedService) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une prestation
const deleteService = async (req, res) => {
    const { serviceID } = req.params;
    try {
        const deletedService = await serviceService.deleteService(serviceID);
        if (!deletedService) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(204).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createService,
    getServiceById,
    getAllServices,
    updateService,
    deleteService
};
