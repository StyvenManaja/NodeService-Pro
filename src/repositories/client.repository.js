const Client = require('../models/Clients');

// Création d'un client
const createClient = async (clientData) => {
    try {
        const client = new Client(clientData);
        return await client.save();
    } catch (error) {
        // Gestion des doublons MongoDB (code 11000)
        if (error.code === 11000) {
            throw new Error('Client already exists: ' + error.message);
        }
        // Gestion des autres erreurs de création
        throw new Error('Error on creating client: ' + error.message);
    }
};

// Récupération d'un client par ID
const getClientById = async (clientId) => {
    try {
        return await Client.findById(clientId);
    } catch (error) {
        throw new Error('Error fetching client: ' + error.message);
    }
};

// Récuperation de la liste de tous les clients
const getAllClients = async () => {
    try {
        return await Client.find();
    } catch (error) {
        throw new Error('Error fetching clients: ' + error.message);
    }
};

// Mise à jour d'un client
const updateClient = async (clientId, clientData) => {
    try {
        return await Client.findByIdAndUpdate(clientId, clientData, { new: true });
    } catch (error) {
        throw new Error('Error updating client: ' + error.message);
    }
};

// Suppression d'un client
const deleteClient = async (clientId) => {
    try {
        return await Client.findByIdAndDelete(clientId);
    } catch (error) {
        throw new Error('Error deleting client: ' + error.message);
    }
};

module.exports = {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient
};
