const express = require('express');
const customerController = require('../controllers/customer.controller');
const authenticateUser = require('../middlewares/authentication');
const customerValidation = require('../middlewares/customer.validator');

const router = express.Router();

// Création d'un client
router.post('/', authenticateUser, customerValidation.validateCreateCustomer, customerController.createCustomer);

// Récuperation de la liste de tous les clients
router.get('/', authenticateUser, customerController.getAllCustomers);

// Récuperer un client avec son ID
router.get('/:customerId', authenticateUser, customerController.getCustomerById);

// Mettre à jour les données d'un client
router.put('/:customerId', authenticateUser, customerValidation.validateUpdateCustomer, customerController.updateCustomer);

// Supprimer un client
router.delete('/:customerId', authenticateUser, customerController.deleteCustomer);

module.exports = router;