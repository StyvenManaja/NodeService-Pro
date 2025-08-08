// Middleware d'authentification JWT basé sur l'ID utilisateur stocké dans les cookies
const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification pour vérifier le token JWT.
 * Si le token est valide, l'ID utilisateur est attaché à req.userId.
 * Sinon, une réponse 401 Unauthorized est envoyée.
 */

module.exports = function authenticateUser(req, res, next) {
    // Récupération du token JWT depuis les cookies (accessToken)
    const token = req.cookies && req.cookies.accessToken;
    if (!token) {
        // Aucun token trouvé dans les cookies
        return res.status(401).json({ error: 'Authentication token missing' });
    }
    try {
        // Vérification et décodage du token (version synchrone)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Ajout de l'ID utilisateur à l'objet req pour les prochaines middlewares/routes
        req.userId = decoded.userId;
        next();
    } catch (error) {
        // Token invalide ou expiré
        return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
};
