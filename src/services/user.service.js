const userRepository = require('../repositories/user.repository');
const verificationRepository = require('../repositories/verification.repository');
const mailSender = require('../utils/mail.sender');
const tokenGenerator = require('../utils/token.generator');

// Service pour créer un nouvel utilisateur
// Prépare les données et délègue la création au repository
const createUser = async (username, lastname, firstname, email, password) => {
    try {
        const userData = {
            username,
            lastname,
            firstname,
            email,
            password
        };
        const user = await userRepository.createUser(userData);
        if(user) {
            const code = await verificationRepository.createAVerificationCode(user._id);
            if(code) {
                const c = code.code;
                // Envoyer le code de vérification par e-mail
                await mailSender.sendMail({
                    to: user.email,
                    subject: 'Vérification de votre compte',
                    templateName: 'verification',
                    templateVars: { code: c }
                });
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
        // On récupère l'utilisateur par son ID et on exclut le mot de passe
        const user = await userRepository.getUserById(userId);
        if(user) {
            return {
                id: user._id,
                username: user.username,
                email: user.email
            };
        }
        return null;
    } catch (error) {
        console.error('Error on finding user by id:', error);
        throw new Error('Error on finding user by id');
    }
};

// Service pour changer de mot de passe
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            throw new Error('Incorrect old password');
        }
    user.password = newPassword;
    user.resetLinkAttempt = 0;
    await user.save();
    return true;
    } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Error changing password');
    }
};

// Service pour envoyer un lien de réinitialisation de mot de passe
const sendPasswordResetCode = async (email) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        // Vérifie la tentative de reset par lien
        if (user.resetLinkAttempt >= 1) {
            throw new Error('Password reset link already sent. Please use the link or contact support.');
        }
        user.resetLinkAttempt += 1;
        await user.save();
        const temporaryToken = tokenGenerator.generateTemporaryToken(user._id);
        try {
            await mailSender.sendMail({
                to: user.email,
                subject: 'Réinitialisation de votre mot de passe',
                templateName: 'reset',
                templateVars: { resetLink: `https://frontend-domain.com/reset-password?token=${temporaryToken}` }
            });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Error sending password reset email');
        }
        return true;
    } catch (error) {
        console.error('Error sending password reset code:', error);
        throw new Error('Error sending password reset code');
    }
};

// Service pour réinitialiser le mot de passe
const resetPassword = async (userId, newPassword) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.password = newPassword;
        await user.save();
        return true;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error('Error resetting password');
    }
};

// Service pour supprimer un compte
const deleteAccount = async (userId) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await userRepository.deleteAccount(userId);
        return true;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw new Error('Error deleting account');
    }
};

// Export des services pour utilisation dans les contrôleurs
module.exports = {
    createUser,
    findUserByEmail,
    sendPasswordResetCode,
    getUserById,
    changePassword,
    resetPassword,
    deleteAccount
};
