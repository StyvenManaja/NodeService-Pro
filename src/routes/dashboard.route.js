const express = require('express')
const dashboardController = require('../controllers/dashboard.controller');
const authenticateUser = require('../middlewares/authentication');
const isVerified = require('../middlewares/isVerified');
const verifySubscription = require('../middlewares/verifySubscription');

const router = express.Router();

router.get('/', authenticateUser, isVerified, verifySubscription, dashboardController.getDashboard);

module.exports = router;