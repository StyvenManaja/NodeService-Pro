const userRepository = require('../repositories/user.repository');
const verificationRepository = require('../repositories/verification.repository');
const mailSender = require('../utils/mail.sender');
const tokenGenerator = require('../utils/token.generator');
const AppError = require('../utils/AppError');

// Service pour créer un nouvel utilisateur
// Prépare les données et délègue la création au repository
const createUser = async (username, lastname, firstname, email, password) => {
    try {
        const user = await userRepository.createUser({ username, lastname, firstname, email, password });
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
            } else {
                throw new AppError('Can not send mail', 500);
            }
            return user;
        }
        throw new AppError('Can not create user', 400);
    } catch (error) {
        if (error.message.startsWith('DUPLICATE_')) {
            const field = error.message.replace('DUPLICATE_', '').toLowerCase();
            throw new AppError(`User ${field} already exists`, 409);
        }
        if (error instanceof AppError) throw error;
        throw new AppError('Unexpected error on creating user', 500);
    }
};

// Service pour trouver un utilisateur par email
const findUserByEmail = async (email) => {
    try {
        const user = await userRepository.findUserByEmail(email);
        if (user) {
            return user;
        }
        throw new AppError('User not found', 404);
    } catch (error) {
        throw new AppError('Error on getting user by email', 500);
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
        throw new AppError('User not found', 404);
    } catch (error) {
        throw new AppError('Error on getting the user by Id', 500);
    }
};

// Service pour changer de mot de passe
const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            throw new AppError('Incorrect old password', 400);
        }
    user.password = newPassword;
    user.resetLinkAttempt = 0;
    await user.save();
    return true;
    } catch (error) {
        throw new AppError('Error on changing the password', 500);
    }
};

// Service pour envoyer un lien de réinitialisation de mot de passe
const sendPasswordResetCode = async (email) => {
    try {
        const frontend_domain = process.env.FRONTEND_URL;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        // Vérifie la tentative de reset par lien
        if (user.resetLinkAttempt >= 1) {
            throw new AppError('Password reset link already sent. Please use the link or contact support.', 400);
        }
        user.resetLinkAttempt += 1;
        await user.save();
        const temporaryToken = tokenGenerator.generateTemporaryToken(user._id);
        try {
            await mailSender.sendMail({
                to: user.email,
                subject: 'Réinitialisation de votre mot de passe',
                templateName: 'reset',
                templateVars: { resetLink: `${frontend_domain}/reset-password?token=${temporaryToken}` }
            });
        } catch (error) {
            throw new AppError('Error sending password reset email', 500);
        }
        return true;
    } catch (error) {
        throw new AppError('Error sending password reset code', 500);
    }
};

// Service pour réinitialiser le mot de passe
const resetPassword = async (userId, newPassword) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        user.password = newPassword;
        await user.save();
        return true;
    } catch (error) {
        throw new AppError('Error resetting password', 500);
    }
};

// Service pour supprimer un compte
const deleteAccount = async (userId) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        await userRepository.deleteAccount(userId);
        return true;
    } catch (error) {
        throw new AppError('Error deleting account', 500);
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
