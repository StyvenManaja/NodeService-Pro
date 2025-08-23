const verificationRepository = require('../repositories/verification.repository');

const verifyCode = async (userId, code) => {
    const verification = await verificationRepository.findVerificationByCode(userId);
    if (verification && verification.code === code && verification.expiresAt > Date.now()) {
        const deleted = await verificationRepository.deleteVerification(verification._id);
        if (deleted) {
            return true;
        }
    }
    return false;
};

module.exports = {
    verifyCode
};
