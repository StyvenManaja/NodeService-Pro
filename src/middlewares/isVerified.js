const verificationRepository = require('../repositories/verification.repository');

// Middleware pour vérifier si l'utilisateur(email) est vérifié
const isVerified = async (req, res, next) => {
    const userId = req.userId;
    try {
        // On cherche la vérification de l'utilisateur et si trouvé, cela veux dire qu'il est toujours à vérifier(pas de pass)
        const found = await verificationRepository.findVerificationByCode(userId);
        if (!found) {
            next();
        } else {
            res.status(403).json({ error: 'Utilisateur non vérifié' });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

module.exports = isVerified;
