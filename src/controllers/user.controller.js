// Importation du service utilisateur pour la logique métier
const userService = require('../services/user.service');
const AppError = require('../utils/AppError');

// JWT
const jwt = require('jsonwebtoken');
const tokenGenerator = require('../utils/token.generator');

// Contrôleur pour créer un nouvel utilisateur
// Récupère les données du corps de la requête, appelle le service, et gère la réponse
const createUser = async (req, res, next) => {
    try {
        const { username, email, password, lastname, firstname } = req.body;
        const user = await userService.createUser(username, lastname, firstname, email, password);
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
        res.status(201).json({
            status: 'success',
            data: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};


// Contrôleur pour connecter un utilisateur
// Vérifie l'email et le mot de passe, puis retourne les infos si succès
const connectUser = async (req, res, next) => {
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
                status: 'success',
                data: {
                    username: user.username,
                    email: user.email
                }
            });
        }
        throw new AppError('Invalid credentials', 401);
    } catch (error) {
        next(error);
    }
};

// Contrôleur pour récupérer les données de l'utilisateur authentifié
// Utilise l'ID utilisateur extrait du token JWT par le middleware d'authentification
const getUserById = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await userService.getUserById(userId);
        // Retourne les informations de l'utilisateur (hors mot de passe)
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// Controller pour deconnecter un utilisateur
const disconnectUser = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Logged out successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Controller pour rafraîchir le token
const refreshToken = (req, res) => {
    // Logique pour rafraîchir le token
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new AppError('Missing token', 401);
    }
    // Vérification et génération d'un nouveau token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            throw new AppError('Expires or invalid token', 401);
        }
        const newToken = tokenGenerator.generateAccessToken({ id: user.id });
        res.cookie('accessToken', newToken, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        });
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Token refreshed successfully'
            }
        });
    });
};

// Controller pour changer le mot de pass d'un utilisateur
const changePassword = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.body;

        // Appelle le service pour changer le mot de passe
        await userService.changePassword(userId, oldPassword, newPassword);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Password changed successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Controller pour envoyer un lien de réinitialisation
const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        await userService.sendPasswordResetCode(email);
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Password reset link sent'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Controller pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;
        jwt.verify(token, process.env.TEMPORARY_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                throw new AppError('Invalid or expired token', 401);
            }
            const userId = decoded.userId;
            await userService.resetPassword(userId, newPassword);
            res.status(200).json({
                status: 'success',
                data: {
                    message: 'Password reset successfully'
                }
            });
        });
    } catch (error) {
        next(error);
    }
};

// Controller pour supprimer un compte
const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.userId;
        await userService.deleteAccount(userId);
        // Clear cookies upon account deletion
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Account deleted successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Export des contrôleurs pour utilisation dans les routes
module.exports = { createUser, connectUser, getUserById, disconnectUser, refreshToken, changePassword, forgotPassword, resetPassword, deleteAccount };