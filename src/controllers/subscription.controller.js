const axios = require('axios');

const createCheckoutSession = async (req, res, next) => {
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
            status: 'success',
            checkoutUrl: response.data.data.attributes.url
        });
    } catch (error) {
        next(error);
    }
};

const getSubscriptionData = async (req, res, next) => {
    const userId = req.userId;
    try {
        const subscriptionData = await subscriptionService.getSubscriptionData(userId);
        return res.status(200).json({
            status: 'success',
            data: subscriptionData
        });
    } catch (error) {
        next(error);
    }
};

const cancelSubscription = async (req, res, next) => {
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
            status: 'success',
            message: 'Subscription canceled successfully'
        });
    } catch (error) {
        next(error);
    }
}

const resumeSubscription = async (req, res, next) => {
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
            status: 'success',
            message: 'Subscription resumed successfully'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCheckoutSession,
    getSubscriptionData,
    cancelSubscription,
    resumeSubscription
};