const clientRepository = require('../repositories/client.repository');

// Création d'un client
const createClient = async (userId, name, company, email, phone) => {
    const clientData = { user: userId, name, company, email, phone };
    return await clientRepository.createClient(clientData);
};

// Récupération d'un client par ID
const getClientById = async (userId, clientId) => {
    return await clientRepository.getClientById(userId, clientId);
};

// Récuperation de la liste de tous les clients
const getAllClients = async (userId) => {
    return await clientRepository.getAllClients(userId);
};

// Mise à jour d'un client
const updateClient = async (userId, clientId, clientData) => {
    return await clientRepository.updateClient(userId, clientId, clientData);
};

// Suppression d'un client
const deleteClient = async (userId, clientId) => {
    return await clientRepository.deleteClient(userId, clientId);
};

module.exports = {
    createClient,
    getClientById,
    getAllClients,
    updateClient,
    deleteClient
};
