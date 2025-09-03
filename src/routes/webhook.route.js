const router = require('express').Router();
const webhookController = require('../controllers/webhook.controller');

router.post('/lemonsqueezy', webhookController.getWebhook);

module.exports = router;