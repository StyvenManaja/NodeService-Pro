const userRepository = require('../repositories/user.repository');
const verificationRepository = require('../repositories/verification.repository');
const mailSender = require('../utils/mail.sender');

// Service pour créer un nouvel utilisateur
// Prépare les données et délègue la création au repository
const createUser = async (username, email, password) => {
    try {
        const userData = {
            username,
            email,
            password
        };
        const user = await userRepository.createUser(userData);
        if(user) {
            const code = await verificationRepository.createAVerificationCode(user._id);
            if(code) {
                // Envoyer le code de vérification par e-mail
                await mailSender.sendVerificationEmail(user.email, code);
            }
        }
        return user;
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
