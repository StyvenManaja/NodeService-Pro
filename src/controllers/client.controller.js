const clientService = require('../services/client.service');

// Création d'un client
const createClient = async (req, res) => {
    const { name, company, email, phone } = req.body;
    const userId = req.userId; // Récupération de l'ID utilisateur à partir du token
    try {
        const client = await clientService.createClient(userId, name, company, email, phone);
        if(!client) {
            return res.status(400).json({ error: 'Error creating client' });
        }
        res.status(200).json(client);
    } catch (error) {
        // Gestion des erreurs (doublon ou erreur serveur)
        const status = error.message.includes('already exists') ? 409 : 500;
        res.status(status).json({ error: error.message });
    }
};

// Récuperation de la liste de tous les clients
const getAllClients = async (req, res) => {
    const userId = req.userId; // Récupération de l'ID utilisateur à partir du token
    try {
        const clients = await clientService.getAllClients(userId);
        if(!clients || clients.length === 0) {
            return res.status(404).json({ error: 'No clients found' });
        }
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récuperer un client avec son ID
const getClientById = async (req, res) => {
    const { clientId } = req.params;
    const userId = req.userId; // Récupération de l'ID utilisateur à partir du token
    try {
        const client = await clientService.getClientById(userId, clientId);
        if(!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour les données d'un client
const updateClient = async (req, res) => {
    const { clientId } = req.params;
    const clientData = req.body;
    const userId = req.userId; // Récupération de l'ID utilisateur à partir du token
    try {
        const updatedClient = await clientService.updateClient(userId, clientId, clientData);
        if(!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un client
const deleteClient = async (req, res) => {
    const { clientId } = req.params;
    const userId = req.userId; // Récupération de l'ID utilisateur à partir du token
    try {
        const deletedClient = await clientService.deleteClient(userId, clientId);
        if(!deletedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
};