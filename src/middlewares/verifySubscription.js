const subscriptionService = require('../services/subscription.service');

// Middleware pour vérifier l'état de l'abonnement et restreindre l'accès à des routes si en status 'expired'
const verifySubscription = async (req, res, next) => {
    try {
        const userId = req.userId;
        const userSubscription = await subscriptionService.getSubscriptionData(userId);

        if(!userSubscription) {
            return res.status(403).json({ error: 'You do not have an active subscription to access this resource' });
        }

        if (userSubscription && userSubscription.status === 'expired') {
            return res.status(403).json({ error: 'Subscription has expired' });
        }

        next();
    } catch (error) {
        console.error('Error verifying subscription:', error);
        return res.status(500).json({ error: 'Failed to verify subscription' });
    }
};

module.exports = verifySubscription;