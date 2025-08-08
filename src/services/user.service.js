
// Importation du repository utilisateur pour l'accès aux données
const userRepository = require('../repositories/user.repository');

// Service pour créer un nouvel utilisateur
// Prépare les données et délègue la création au repository
const createUser = async (username, email, password) => {
    try {
        const userData = {
            username,
            email,
            password
        };
        return await userRepository.createUser(userData);
    } catch (error) {
        console.error('Error on creating user:', error);
        throw new Error('Error on creating user');
    }
};


// Service pour trouver un utilisateur par email
const findUserByEmail = async (email) => {
    try {
        return await userRepository.findUserByEmail(email);
    } catch (error) {
        console.error('Error on finding user by email:', error);
        throw new Error('Error on finding user by email');
    }
};

// Service pour récupérer un utilisateur par son identifiant
const getUserById = async (userId) => {
    try {
        return await userRepository.getUserById(userId);
    } catch (error) {
        console.error('Error on finding user by id:', error);
        throw new Error('Error on finding user by id');
    }
};

// Export des services pour utilisation dans les contrôleurs
module.exports = {
    createUser,
    findUserByEmail,
    getUserById
};
