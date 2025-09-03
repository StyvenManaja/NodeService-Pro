const crypto = require('crypto');
const subscriptionService = require('../services/subscription.service');

const getWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-signature'];
        const payload = req.body; // Buffer

        const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
        hmac.update(payload);
        const digest = hmac.digest('hex');

        if (signature !== digest) {
            return res.status(401).json({ error: 'Invalid signature' });
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
                    return res.status(409).json({ message: 'User already has an active subscription.' });
                }
                if(!subscription) { return res.status(400).json({ message: 'Failed to create subscription.' }) };
                res.status(200).json({ message: 'Subscription created successfully.' });
                break;
            }
            case 'subscription_cancelled':
            {
                const lemonSqueezyId = event.data.id;
                const canceled = await subscriptionService.cancelSubscription(lemonSqueezyId);
                if(!canceled) { return res.status(400).json({ message: 'Failed to cancel subscription.' }) };
                res.status(200).json({ message: 'Subscription canceled successfully.' });
                break;
            }
            case 'subscription_resumed':
            {
                const lemonSqueezyId = event.data.id;
                const resumed = await subscriptionService.resumeSubscription(lemonSqueezyId);
                if(!resumed) { return res.status(400).json({ message: 'Failed to resume subscription.' }) };
                res.status(200).json({ message: 'Subscription resumed successfully.' });
                break;
            }
            case 'subscription_expired':
            {
                const lemonsqueezyId = event.data.id;
                const subscription = await subscriptionService.expireSubscription(lemonsqueezyId);
                if(!subscription) { return res.status(400).json({ message: 'Failed to set subscription status to expired.' }) };
                res.status(200).json({ message: 'Subscription set expired successfully.' });
                break;
            }
        }
    } catch (error) {
        console.error('Error handling webhook:', error);
        return res.status(500).json({ error: 'Failed to handle webhook' });
    }
};

module.exports = { getWebhook };
