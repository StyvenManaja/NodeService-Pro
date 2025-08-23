const express = require('express');
const clientController = require('../controllers/client.controller');
const authenticateUser = require('../middlewares/authentication');
const clientValidation = require('../middlewares/client.validator');
const isVerified = require('../middlewares/isVerified');

const router = express.Router();

// Création d'un client
router.post('/', authenticateUser, isVerified, clientValidation.validateCreateClient, clientController.createClient);

// Récuperation de la liste de tous les clients
router.get('/', authenticateUser, isVerified, clientController.getAllClients);

// Récuperer un client avec son ID
router.get('/:clientId', authenticateUser, isVerified, clientController.getClientById);

// Mettre à jour les données d'un client
router.put('/:clientId', authenticateUser, isVerified, clientValidation.validateUpdateClient, clientController.updateClient);

// Supprimer un client
router.delete('/:clientId', authenticateUser, isVerified, clientController.deleteClient);

module.exports = router;