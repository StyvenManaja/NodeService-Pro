const axios = require('axios');

const createCheckoutSession = async (req, res) => {
    const userId = req.userId;
    try {
        const response = await axios.post(
            'https://api.lemonsqueezy.com/v1/checkouts',
            {
                "data": {
                    "type": "checkouts",
                    "attributes": {
                        "checkout_data": {
                            "custom": {
                                "userId": userId
                            }
                        }
                    },
                    "relationships": {
                        "store": {
                            "data": {
                                "type": "stores",
                                "id": process.env.LEMONSQUEEZY_STORE_ID
                            }
                        },
                        "variant": {
                            "data": {
                                "type": "variants",
                                "id": process.env.LEMONSQUEEZY_PRODUCT_ID
                            }
                        }
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.LEMONSQUEEZY_SECRET_KEY}`,
                    'Content-Type': 'application/vnd.api+json'
                }
            }
        );

        return res.status(200).json({
            checkoutUrl: response.data.data.attributes.url
        });
    } catch (error) {
        console.error('Error creating checkout session:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

const getSubscriptionData = async (req, res) => {
    const userId = req.userId;
    try {
        const subscriptionData = await subscriptionService.getSubscriptionData(userId);
        return res.status(200).json(subscriptionData);
    } catch (error) {
        console.error('Error getting subscription data:', error);
        return res.status(500).json({ error: 'Failed to get subscription data' });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const subscriptionId = req.params.id;
        const response = await axios.delete(
            `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.LEMONSQUEEZY_SECRET_KEY}`,
                    'Content-Type': 'application/vnd.api+json'
                }
            }
        );

        return res.status(200).json({
            message: 'Subscription canceled successfully'
        });
    } catch (error) {
        console.error('Error canceling subscription:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to cancel subscription' });
    }
}

const resumeSubscription = async (req, res) => {
    try {
        const lemonSqueezyId = req.params.id;
        const response = await axios.patch(
            `https://api.lemonsqueezy.com/v1/subscriptions/${lemonSqueezyId}`,
            {
                "data": {
                    "type": "subscriptions",
                    "id": lemonSqueezyId,
                    "attributes": {
                        "canceled": "false"
                    }
                }
            },
            {
                headers: {
                    Accept: 'application/vnd.api+json',
                    Authorization: `Bearer ${process.env.LEMONSQUEEZY_SECRET_KEY}`,
                    'Content-Type': 'application/vnd.api+json'
                }
            }
        );

        return res.status(200).json({
            message: 'Subscription resumed successfully'
        });
    } catch (error) {
        console.error('Error resuming subscription:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to resume subscription' });
    }
}

module.exports = {
    createCheckoutSession,
    getSubscriptionData,
    cancelSubscription,
    resumeSubscription
};