const Subscription = require('../models/Subscription');

// Enregistrer les données d'abonnement
const registerSubscription = async (subscriptionData) => {
    try {
        // Vérifie s'il existe déjà un abonnement actif pour cet utilisateur
        const existingActive = await Subscription.findOne({ userId: subscriptionData.userId, status: 'active' });
        if (existingActive) {
            throw new Error('User already has an active subscription');
        }
        const subscription = new Subscription(subscriptionData);
        await subscription.save();
        return subscription;
    } catch (error) {
        console.error('Error registering subscription: ', error.message);
        throw new Error('Failed to register subscription: ' + error.message);
    }
};

// Récuperer les données d'un abonnement
const getSubscriptionData = async (userId) => {
    try {
        return await Subscription.findOne({ userId: userId });
    } catch (error) {
        console.error('Error getting subscription data: ', error.message);
        throw new Error('Failed to get subscription data: ' + error.message);
    }
};

// Annuler un abonnement
const cancelSubscription = async (lemonSqueezyId) => {
    try {
        const id = lemonSqueezyId.toString();
        return await Subscription.findOneAndUpdate({ lemonSqueezyId: id }, {
            status: 'canceled'
        }, { new: true });
    } catch (error) {
        console.error('Error canceling subscription: ', error.message);
        throw new Error('Failed to cancel subscription: ' + error.message);
    }
}

// Reprendre un abonnement
const resumeSubscription = async (lemonSqueezyId) => {
    try {
        const id = lemonSqueezyId.toString();
        return await Subscription.findOneAndUpdate({ lemonSqueezyId: id }, {
            status: 'active'
        }, { new: true });
    } catch (error) {
        console.error('Error resuming subscription: ', error.message);
        throw new Error('Failed to resume subscription: ' + error.message);
    }
}

// Expirer un abonnement
const expireSubscription = async (lemonSqueezyId) => {
    try {
        const id = lemonSqueezyId.toString();
        return await Subscription.findOneAndUpdate({ lemonSqueezyId: id }, {
            status: 'expired'
        }, { new: true });
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
};
