const clientService = require('../services/client.service');

// Création d'un client
const createClient = async (req, res, next) => {
    const { name, company, email, phone } = req.body;
    const userId = req.userId;
    try {
        const client = await clientService.createClient(userId, name, company, email, phone);
        res.status(201).json({
            status: 'success',
            data: client
        });
    } catch (error) {
        next(error);
    }
};

// Récuperation de la liste de tous les clients
const getAllClients = async (req, res, next) => {
    const userId = req.userId;
    try {
        const clients = await clientService.getAllClients(userId);
        res.status(200).json({
            status: 'success',
            data: clients
        });
    } catch (error) {
        next(error);
    }
};

// Récuperer un client avec son ID
const getClientById = async (req, res, next) => {
    const { clientId } = req.params;
    const userId = req.userId;
    try {
        const client = await clientService.getClientById(userId, clientId);
        res.status(200).json({
            status: 'success',
            data: client
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour les données d'un client
const updateClient = async (req, res, next) => {
    const { clientId } = req.params;
    const clientData = req.body;
    const userId = req.userId;
    try {
        const updatedClient = await clientService.updateClient(userId, clientId, clientData);
        res.status(200).json({
            status: 'success',
            data: updatedClient
        });
    } catch (error) {
        next(error);
    }
};

// Supprimer un client
const deleteClient = async (req, res, next) => {
    const { clientId } = req.params;
    const userId = req.userId;
    try {
        const deletedClient = await clientService.deleteClient(userId, clientId);
        res.status(204).json({
            status: 'success',
            data: deletedClient
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
};