const verificationService = require('../services/verification.service');

const verifyCode = async (req, res) => {
    const { code } = req.body;
    const userId = req.userId;
    try {
        const isValid = await verificationService.verifyCode(userId, code);
        if (isValid) {
            res.status(200).json({ message: 'Code vérifié avec succès' });
        } else {
            res.status(400).json({ error: 'Code de vérification invalide ou expiré' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du code:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = {
    verifyCode
};
