const express = require('express');
const prestationController = require('../controllers/prestation.controller');
const authenticateUser = require('../middlewares/authentication');
const prestationValidator = require('../middlewares/prestation.validator');
const isVerified = require('../middlewares/isVerified');
const verifySubscription = require('../middlewares/verifySubscription');

const router = express.Router();

router.post('/', authenticateUser, isVerified, verifySubscription, prestationValidator.validateCreatePrestation, prestationController.createPrestation);
router.get('/:prestationID', authenticateUser, isVerified, verifySubscription, prestationController.getPrestationById);
router.get('/', authenticateUser, isVerified, verifySubscription, prestationController.getAllPrestations);
router.put('/:prestationID', authenticateUser, isVerified, verifySubscription, prestationValidator.validateUpdatePrestation, prestationController.updatePrestation);
router.delete('/:prestationID', authenticateUser, isVerified, verifySubscription, prestationController.deletePrestation);

module.exports = router;
