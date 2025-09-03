const router = require('express').Router();
const authenticateUser = require('../middlewares/authentication');
const subscriptionController = require('../controllers/subscription.controller');

router.post('/checkout-session', authenticateUser, subscriptionController.createCheckoutSession);
router.get('/data', authenticateUser, subscriptionController.getSubscriptionData);
router.delete('/cancel/:id', authenticateUser, subscriptionController.cancelSubscription);
router.patch('/resume/:id', authenticateUser, subscriptionController.resumeSubscription);

module.exports = router;