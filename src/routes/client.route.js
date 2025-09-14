const express = require('express');
const clientController = require('../controllers/client.controller');
const authenticateUser = require('../middlewares/authentication');
const clientValidation = require('../middlewares/client.validator');
const isVerified = require('../middlewares/isVerified');
const verifySubscription = require('../middlewares/verifySubscription');

const router = express.Router();

// Création d'un client
router.post('/', authenticateUser, isVerified, verifySubscription, clientValidation.validateCreateClient, clientController.createClient);

// Récuperation de la liste de tous les clients
router.get('/', authenticateUser, isVerified, verifySubscription, clientController.getAllClients);

// Récuperer un client avec son ID
router.get('/:clientId', authenticateUser, isVerified, verifySubscription, clientController.getClientById);

// Mettre à jour les données d'un client
router.put('/:clientId', authenticateUser, isVerified, verifySubscription, clientValidation.validateUpdateClient, clientController.updateClient);

// Supprimer un client
router.delete('/:clientId', authenticateUser, isVerified, verifySubscription, clientController.deleteClient);

module.exports = router;