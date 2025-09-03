const subscriptionRepository = require('../repositories/subscription.repository');

// Enregistrer un abonnement
const registerSubscription = async (userId, lemonSqueezyId) => {
    try {
        const subscriptionData = { userId, lemonSqueezyId }
        return await subscriptionRepository.registerSubscription(subscriptionData);
    } catch (error) {
        if (error.message.includes('User already has an active subscription')) {
            return { error: 'User already has an active subscription' };
        }
        console.error('Error registering subscription:', error.message);
        throw new Error('Failed to register subscription: ' + error.message);
    }
}

// Récuperer les données d'un abonnement
const getSubscriptionData = async (userId) => {
    try {
        return await subscriptionRepository.getSubscriptionData(userId);
    } catch (error) {
        console.error('Error getting subscription data:', error.message);
        throw new Error('Failed to get subscription data: ' + error.message);
    }
};

// Annuler un abonnement
const cancelSubscription = async (lemonSqueezyId) => {
    try {
        return await subscriptionRepository.cancelSubscription(lemonSqueezyId);
    } catch (error) {
        console.error('Error canceling subscription: ', error.message);
        throw new Error('Failed to cancel subscription: ' + error.message);
    }
}

// Reprendre un abonnement
const resumeSubscription = async (lemonSqueezyId) => {
    try {
        return await subscriptionRepository.resumeSubscription(lemonSqueezyId);
    } catch (error) {
        console.error('Error resuming subscription: ', error.message);
        throw new Error('Failed to resume subscription: ' + error.message);
    }
}

// Abonnement expiré
const expireSubscription = async (lemonSqueezyId) => {
    try {
        return await subscriptionRepository.expireSubscription(lemonSqueezyId);
    } catch (error) {
        console.error('Error expiring subscription: ', error.message);
        throw new Error('Failed to expire subscription: ' + error.message);
    }
}

module.exports = {
    registerSubscription,
    getSubscriptionData,
    cancelSubscription,
    resumeSubscription,
    expireSubscription
}