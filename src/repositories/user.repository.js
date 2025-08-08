
// Importation du modèle User pour interagir avec la collection MongoDB
const User = require('../models/User');

// Crée une nouvelle entrée utilisateur dans la base de données
// Gère les erreurs de validation et les doublons
const createUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        // Gestion des doublons MongoDB (code 11000)
        if (error.code === 11000) {
            throw new Error('User already exists: ' + error.message);
        }
        // Gestion des autres erreurs de création
        throw new Error('Error on creating user: ' + error.message);
    }
};

// Recherche un utilisateur par email dans la base de données
const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        console.error('Error on finding user by email:', error);
        throw new Error('Error on finding user by email');
    }
};

// Recherche un utilisateur par son identifiant unique
const getUserById = async (userId) => {
    try {
        return await User.findById(userId).select('-password'); // On exclut le mot de passe
    } catch (error) {
        console.error('Error on finding user by id:', error);
        throw new Error('Error on finding user by id');
    }
};

// Export des fonctions du repository pour utilisation dans les services
module.exports = {
    createUser,
    findUserByEmail,
    getUserById
};