const express = require('express');
const userController = require('../controllers/user.controller');
const userValidator = require('../middlewares/user.validator');
const authenticateUser = require('../middlewares/authentication');
const isVerified = require('../middlewares/isVerified');

const router = express.Router();

// Création d'un nouvel utilisateur (inscription)
router.post('/create', userValidator.validateCreateUser, userController.createUser);

// Connexion utilisateur
router.post('/connect', userValidator.validateConnectUser, userController.connectUser);

// Récupérer les infos de l'utilisateur connecté (JWT + vérification)
router.get('/me', authenticateUser, isVerified, userController.getUserById);

// Rafraîchir le token JWT
router.post('/refresh', userController.refreshToken);

// Déconnexion (supprime les cookies JWT)
router.post('/disconnect', userController.disconnectUser);

// Changement de mot de passe (authentifié)
router.put('/change-password', authenticateUser, userValidator.validateChangePassword, userController.changePassword);

// Envoi du lien de réinitialisation de mot de passe
router.post('/forgot-password', userValidator.validateForgotPassword, userController.forgotPassword);

// Réinitialisation du mot de passe via token temporaire
router.put('/reset-password', userValidator.validateResetPassword, userController.resetPassword);

// Suppression du compte utilisateur (authentifié)
router.delete('/delete-account', authenticateUser, userController.deleteAccount);

module.exports = router;
