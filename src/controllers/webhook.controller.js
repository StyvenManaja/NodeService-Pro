const crypto = require('crypto');
const subscriptionService = require('../services/subscription.service');
const AppError = require('../utils/AppError');

const getWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-signature'];
        const payload = req.body; // Buffer

        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
        hmac.update(payload);
        const digest = hmac.digest('hex');

        if (signature !== digest) {
            throw new AppError('Invalid signature', 400);
        }

        // Parser le json
        const event = JSON.parse(payload.toString('utf8'));
        const event_type = event.meta.event_name;

        switch(event_type) {
            case 'subscription_created':
            {
                const userId = event.meta.custom_data.userId;
                const lemonsqueezyId = event.data.id;
                const subscription = await subscriptionService.registerSubscription(userId, lemonsqueezyId);
                if(subscription && subscription.error === 'User already has an active subscription') {
                    throw new AppError('User already has an active subscription', 409);
                }
                if(!subscription) { throw new AppError('Failed to create subscription', 400) };
                res.status(200).json({
                    status: 'success',
                    data: subscription,
                });
                break;
            }
            case 'subscription_cancelled':
            {
                const lemonSqueezyId = event.data.id;
                const canceled = await subscriptionService.cancelSubscription(lemonSqueezyId);
                if(!canceled) { throw new AppError('Failed to cancel subscription', 400) };
                res.status(200).json({
                    status: 'success',
                    message: 'Subscription canceled successfully.'
                });
                break;
            }
            case 'subscription_resumed':
            {
                const lemonSqueezyId = event.data.id;
                const resumed = await subscriptionService.resumeSubscription(lemonSqueezyId);
                if(!resumed) { throw new AppError('Failed to resume subscription', 400) };
                res.status(200).json({
                    status: 'success',
                    message: 'Subscription resumed successfully.'
                });
                break;
            }
            case 'subscription_expired':
            {
                const lemonsqueezyId = event.data.id;
                const subscription = await subscriptionService.expireSubscription(lemonsqueezyId);
                if(!subscription) { throw new AppError('Failed to set subscription status to expired', 400) };
                res.status(200).json({
                    status: 'success',
                    message: 'Subscription set expired successfully.'
                });
                break;
            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getWebhook };
