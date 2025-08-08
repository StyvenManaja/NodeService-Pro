// Importation du service utilisateur pour la logique métier
const userService = require('../services/user.service');

// JWT
const jwt = require('jsonwebtoken');
const tokenGenerator = require('../utils/token.generator');

// Contrôleur pour créer un nouvel utilisateur
// Récupère les données du corps de la requête, appelle le service, et gère la réponse
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await userService.createUser(username, email, password);
        if(!user) {
            return res.status(400).json({ error: 'Error on creating user' });
        }
        // Génère les tokens JWT contenant l'id utilisateur
        const accessToken = tokenGenerator.generateAccessToken(user._id);
        const refreshToken = tokenGenerator.generateRefreshToken(user._id);

        // Envoi des tokens dans les cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30*24*60*60*1000
        });

        // Retourne les infos de l'utilisateur créé (hors mot de passe)
        res.status(200).json({
            username: user.username,
            email: user.email
        });
    } catch (error) {
        // Gestion des erreurs (doublon ou erreur serveur)
        const status = error.message === 'User already exists' ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
};


// Contrôleur pour connecter un utilisateur
// Vérifie l'email et le mot de passe, puis retourne les infos si succès
const connectUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.findUserByEmail(email);
        // Vérifie l'existence de l'utilisateur et la validité du mot de passe
        if(user && await user.comparePassword(password)) {
            // Génère un token JWT contenant l'id utilisateur
            const accessToken = tokenGenerator.generateAccessToken(user._id);
            const refreshToken = tokenGenerator.generateRefreshToken(user._id);

            // Envoi des tokens dans les cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true, secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', maxAge: 7*24*60*60*1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', maxAge: 30*24*60*60*1000
            });

            return res.status(200).json({
                username: user.username,
                email: user.email
            });
        }
        // Identifiants invalides
        return res.status(401).json({ error: 'Invalid email or password' });
    } catch (error) {
        // Erreur serveur
        res.status(500).json({ error: 'Error on connecting user' });
    }
};

// Contrôleur pour récupérer les données de l'utilisateur authentifié
// Utilise l'ID utilisateur extrait du token JWT par le middleware d'authentification
const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Retourne les informations de l'utilisateur (hors mot de passe)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user data' });
    }
};

// Controller pour deconnecter un utilisateur
const disconnectUser = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Déconnexion réussie' });
};

// Controller pour rafraîchir le token
const refreshToken = (req, res) => {
    // Logique pour rafraîchir le token
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Token manquant' });
    }
    // Vérification et génération d'un nouveau token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        const newToken = tokenGenerator.generateAccessToken({ id: user.id });
        res.cookie('accessToken', newToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        });
        res.json({ message: 'Token rafraîchi avec succès' });
    });
};

// Export des contrôleurs pour utilisation dans les routes
module.exports = { createUser, connectUser, getUserById, disconnectUser, refreshToken };