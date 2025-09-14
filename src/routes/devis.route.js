const express = require('express');
const devisController = require('../controllers/devis.controller');
const authenticateUser = require('../middlewares/authentication');
const devisValidator = require('../middlewares/devis.validator');
const isVerified = require('../middlewares/isVerified');
const verifySubscription = require('../middlewares/verifySubscription');

const router = express.Router();

router.post('/', authenticateUser, isVerified, verifySubscription, devisValidator.validateCreateDevis, devisController.createDevis);
router.get('/:devisId', authenticateUser, isVerified, verifySubscription, devisController.getDevisById);
router.get('/', authenticateUser, isVerified, verifySubscription, devisController.getAllDevis);

module.exports = router;
