const Subscription = require('../models/Subscription');

// Enregistrer les données d'abonnement
const registerSubscription = async (subscriptionData) => {
    try {
        // Vérifie s'il existe déjà un abonnement actif pour cet utilisateur
        const existingActive = await Subscription.findOne({ userId: subscriptionData.userId, status: 'active' });
        if (existingActive) {
            throw new Error('DUPLICATE_SUBSCRIPTION');
        }
        const subscription = new Subscription(subscriptionData);
        await subscription.save();
        return subscription;
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

// Récuperer les données d'un abonnement
const getSubscriptionData = async (userId) => {
    try {
        return await Subscription.findOne({ userId: userId });
    } catch (error) {
        throw new Error('DB_ERROR');
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
        throw new Error('DB_ERROR');
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
        throw new Error('DB_ERROR');
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
        throw new Error('DB_ERROR');
    }
}

module.exports = {
    registerSubscription,
    getSubscriptionData,
    cancelSubscription,
    resumeSubscription,
    expireSubscription
};
