const verificationService = require('../services/verification.service');
const AppError = require('../utils/AppError');

const verifyCode = async (req, res, next) => {
    const { code } = req.body;
    const userId = req.userId;
    try {
        const isValid = await verificationService.verifyCode(userId, code);
        if (isValid) {
            res.status(200).json({
                status: 'success',
                message: 'Verification code is valid'
            });
        } else {
            throw new AppError('Invalid or expired verification code', 400);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verifyCode
};
