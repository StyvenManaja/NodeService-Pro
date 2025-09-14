const clientRepository = require('../repositories/client.repository');
const AppError = require('../utils/AppError');

// Création d'un client
const createClient = async (userId, name, company, email, phone) => {
    try {
        const client = await clientRepository.createClient({ user: userId, name, company, email, phone });
        if(!client) {
            throw new AppError('Can not create client', 500);
        }
        return client;
    } catch (error) {
        if (error.message.startsWith('DUPLICATE_')) {
            const field = error.message.replace('DUPLICATE_', '').toLowerCase();
            throw new AppError(`Client ${field} already exists`, 409);
        }
        throw new AppError('Error on creating client', 500);
    }
};

// Récupération d'un client par ID
const getClientById = async (userId, clientId) => {
    try {
        const client = await clientRepository.getClientById(userId, clientId);
        if (!client) {
            throw new AppError('Client not found', 404);
        }
        return client;
    } catch (error) {
        throw new AppError('Error on getting client', 500);
    }
};

// Récuperation de la liste de tous les clients
const getAllClients = async (userId) => {
    try {
        const clients = await clientRepository.getAllClients(userId);
        if(clients.length === 0 || !clients) {
            throw new AppError('No client found', 404);
        }
        return clients;
    } catch (error) {
        throw new AppError('Error on getting clients', 500);
    }
};

// Mise à jour d'un client
const updateClient = async (userId, clientId, clientData) => {
    try {
        const updatedClient = await clientRepository.updateClient(userId, clientId, clientData);
        if (!updatedClient) {
            throw new AppError('Client not found', 404);
        }
        return updatedClient;
    } catch (error) {
        throw new AppError('Error on updating client', 500);
    }
};

// Suppression d'un client
const deleteClient = async (userId, clientId) => {
    try {
        const deletedClient = await clientRepository.deleteClient(userId, clientId);
        if (!deletedClient) {
            throw new AppError('Client not found', 404);
        }
        return deletedClient;
    } catch (error) {
        throw new AppError('Error on deleting client', 500);
    }
};

module.exports = {
    createClient,
    getClientById,
    getAllClients,
    updateClient,
    deleteClient
};
