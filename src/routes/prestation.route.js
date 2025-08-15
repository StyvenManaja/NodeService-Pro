const express = require('express');
const prestationController = require('../controllers/prestation.controller');
const authenticateUser = require('../middlewares/authentication');
const prestationValidator = require('../middlewares/prestation.validator');

const router = express.Router();

router.post('/', authenticateUser, prestationValidator.validateCreatePrestation, prestationController.createPrestation);
router.get('/:prestationID', authenticateUser, prestationController.getPrestationById);
router.get('/', authenticateUser, prestationController.getAllPrestations);
router.put('/:prestationID', authenticateUser, prestationValidator.validateUpdatePrestation, prestationController.updatePrestation);
router.delete('/:prestationID', authenticateUser, prestationController.deletePrestation);

module.exports = router;
