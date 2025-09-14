const subscriptionRepository = require('../repositories/subscription.repository');
const AppError = require('../utils/AppError');

// Enregistrer un abonnement
const registerSubscription = async (userId, lemonSqueezyId) => {
    try {
        const subscription = await subscriptionRepository.registerSubscription({ userId, lemonSqueezyId });
        if(!subscription) {
            throw new AppError('Can not active the subscription', 201);
        }
        return subscription;
    } catch (error) {
        if (error.message.includes('DUPLICATE_SUBSCRIPTION')) {
            throw new AppError('User already has an active subscription', 409);
        }
        throw new AppError('Error registering subscription', 500);
    }
}

// Récuperer les données d'un abonnement
const getSubscriptionData = async (userId) => {
    try {
        const subscription = await subscriptionRepository.getSubscriptionData(userId);
        if (!subscription) {
            throw new AppError('No subscription found', 404);
        }
        return subscription;
    } catch (error) {
        throw new AppError('Error on getting subscription', 500);
    }
};

// Annuler un abonnement
const cancelSubscription = async (lemonSqueezyId) => {
    try {
        const subscription = await subscriptionRepository.cancelSubscription(lemonSqueezyId);
        if (!subscription) {
            throw new AppError('Can not cancel the subscription', 400);
        }
        return subscription;
    } catch (error) {
        throw new AppError('Error on canceling subscription', 500);
    }
}

// Reprendre un abonnement
const resumeSubscription = async (lemonSqueezyId) => {
    try {
        const subscription = await subscriptionRepository.resumeSubscription(lemonSqueezyId);
        if (!subscription) {
            throw new AppError('Can not resume the subscription', 400);
        }
        return subscription;
    } catch (error) {
        throw new AppError('Error on resuming the subscription', 500);
    }
}

// Abonnement expiré
const expireSubscription = async (lemonSqueezyId) => {
    try {
        const subscription = await subscriptionRepository.expireSubscription(lemonSqueezyId);
        if (!subscription) {
            throw new AppError('Can not set the subscription to expired', 400);
        }
        return subscription;
    } catch (error) {
        throw new AppError('Error on expiring the subscription', 500);
    }
}

module.exports = {
    registerSubscription,
    getSubscriptionData,
    cancelSubscription,
    resumeSubscription,
    expireSubscription
}