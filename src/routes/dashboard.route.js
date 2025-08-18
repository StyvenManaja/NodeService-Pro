const express = require('express')
const dashboardController = require('../controllers/dashboard.controller');
const authenticateUser = require('../middlewares/authentication');

const router = express.Router();

router.get('/', authenticateUser, dashboardController.getDashboard);

module.exports = router;