// Importation d'Express pour la gestion des routes
const express = require('express');
// Importation du contrôleur utilisateur
const userController = require('../controllers/user.controller');
// Importation du middleware de validation
const userValidator = require('../middlewares/user.validator');
// Importation du middleware d'authentification
const authenticateUser = require('../middlewares/authentication');

// Création d'un routeur Express
const router = express.Router();

// Route pour la création d'un nouvel utilisateur
router.post('/create', userValidator.validateCreateUser, userController.createUser);

// Route pour la connexion d'un utilisateur
router.post('/connect', userValidator.validateConnectUser, userController.connectUser);

// Route protégée pour récupérer les données de l'utilisateur connecté
router.get('/me', authenticateUser, userController.getUserById);

// Route pour rafraîchir le token
router.post('/refresh', userController.refreshToken);

// Route pour déconnecter un utilisateur
router.post('/disconnect', userController.disconnectUser);

// Export du routeur pour utilisation dans l'application principale
module.exports = router;
