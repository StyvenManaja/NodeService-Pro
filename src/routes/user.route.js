// Importation d'Express pour la gestion des routes
const express = require('express');
// Importation du contrôleur utilisateur
const userController = require('../controllers/user.controller');
// Importation du middleware de validation
const userValidator = require('../middlewares/user.validator');

// Création d'un routeur Express
const router = express.Router();

// Route pour la création d'un nouvel utilisateur
router.post('/users/create', userValidator.validateCreateUser, userController.createUser);

// Route pour la connexion d'un utilisateur
router.post('/users/connect', userValidator.validateConnectUser, userController.connectUser);

// Importation du middleware d'authentification
const authenticateUser = require('../middlewares/authentication');

// Route protégée pour récupérer les données de l'utilisateur connecté
router.get('/users/me', authenticateUser, userController.getUserById);

// Export du routeur pour utilisation dans l'application principale
module.exports = router;
