const express = require('express');
const clientController = require('../controllers/client.controller');
const authenticateUser = require('../middlewares/authentication');
const clientValidation = require('../middlewares/client.validator');

const router = express.Router();

// Création d'un client
router.post('/', authenticateUser, clientValidation.validateCreateClient, clientController.createClient);

// Récuperation de la liste de tous les clients
router.get('/', authenticateUser, clientController.getAllClients);

// Récuperer un client avec son ID
router.get('/:clientId', authenticateUser, clientController.getClientById);

// Mettre à jour les données d'un client
router.put('/:clientId', authenticateUser, clientValidation.validateUpdateClient, clientController.updateClient);

// Supprimer un client
router.delete('/:clientId', authenticateUser, clientController.deleteClient);

module.exports = router;