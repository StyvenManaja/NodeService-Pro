const express = require('express');
const verificationController = require('../controllers/verification.controller');
const authenticateUser = require('../middlewares/authentication');
const validateVerification = require('../middlewares/verification.validator');

const router = express.Router();

// Route pour vérifier un code
router.post('/verify', authenticateUser, validateVerification, verificationController.verifyCode);

module.exports = router;
