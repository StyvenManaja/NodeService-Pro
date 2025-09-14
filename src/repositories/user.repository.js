
// Importation du modèle User pour interagir avec la collection MongoDB
const User = require('../models/User');

// Crée une nouvelle entrée utilisateur dans la base de données
// Gère les erreurs de validation et les doublons
const createUser = async (userData) => {
    try {
        return await User.create(userData);
    } catch (error) {
        // Gestion des doublons MongoDB (code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            throw new Error(`DUPLICATE_${field.toUpperCase()}`);
        }
        // Gestion des autres erreurs de création
        throw new Error('DB_ERROR');
    }
};

// Recherche un utilisateur par email dans la base de données
const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Recherche un utilisateur par son identifiant unique
const getUserById = async (userId) => {
    try {
        return await User.findById(userId).select();
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Supprimer un compte
const deleteAccount = async (userId) => {
    try {
        return await User.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Export des fonctions du repository pour utilisation dans les services
module.exports = {
    createUser,
    findUserByEmail,
    getUserById,
    deleteAccount
};