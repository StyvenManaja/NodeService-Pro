const Verification = require('../models/Verification');

const createAVerificationCode = async (userId) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000); // Génère un code à 6 chiffres
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes à partir de maintenant

        const verification = new Verification({ user: userId, code, expiresAt });
        return await verification.save();
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

const findVerificationByCode = async (userId) => {
    try {
        return await Verification.findOne({ user: userId, verified: false });
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

const deleteVerification = async (id) => {
    try {
        return await Verification.findByIdAndDelete(id);
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

module.exports = {
  createAVerificationCode,
  findVerificationByCode,
  deleteVerification
};
