const verificationRepository = require('../repositories/verification.repository');
const AppError = require('../utils/appError');

const verifyCode = async (userId, code) => {
    try {
        const verification = await verificationRepository.findVerificationByCode(userId);
        if (verification && verification.code === code && verification.expiresAt > Date.now()) {
            const deleted = await verificationRepository.deleteVerification(verification._id);
            if (deleted) {
                return true;
            }
        }
        return false;
    } catch (error) {
        throw new AppError('Error verifying code', 500);
    }
};

module.exports = {
    verifyCode
};
