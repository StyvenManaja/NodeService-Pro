const clientRepository = require('../repositories/client.repository');

// Création d'un client
const createClient = async (name, company, email, phone) => {
    const clientData = { name, company, email, phone };
    return await clientRepository.createClient(clientData);
};

// Récupération d'un client par ID
const getClientById = async (clientId) => {
    return await clientRepository.getClientById(clientId);
};

// Récuperation de la liste de tous les clients
const getAllClients = async () => {
    return await clientRepository.getAllClients();
};

// Mise à jour d'un client
const updateClient = async (clientId, clientData) => {
    return await clientRepository.updateClient(clientId, clientData);
};

// Suppression d'un client
const deleteClient = async (clientId) => {
    return await clientRepository.deleteClient(clientId);
};

module.exports = {
    createClient,
    getClientById,
    getAllClients,
    updateClient,
    deleteClient
};
