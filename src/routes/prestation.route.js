const express = require('express');
const prestationController = require('../controllers/prestation.controller');
const authenticateUser = require('../middlewares/authentication');
const prestationValidator = require('../middlewares/prestation.validator');
const isVerified = require('../middlewares/isVerified');

const router = express.Router();

router.post('/', authenticateUser, isVerified, prestationValidator.validateCreatePrestation, prestationController.createPrestation);
router.get('/:prestationID', authenticateUser, isVerified, prestationController.getPrestationById);
router.get('/', authenticateUser, isVerified, prestationController.getAllPrestations);
router.put('/:prestationID', authenticateUser, isVerified, prestationValidator.validateUpdatePrestation, prestationController.updatePrestation);
router.delete('/:prestationID', authenticateUser, isVerified, prestationController.deletePrestation);

module.exports = router;
