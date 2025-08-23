const express = require('express')
const dashboardController = require('../controllers/dashboard.controller');
const authenticateUser = require('../middlewares/authentication');
const isVerified = require('../middlewares/isVerified');

const router = express.Router();

router.get('/', authenticateUser, isVerified, dashboardController.getDashboard);

module.exports = router;