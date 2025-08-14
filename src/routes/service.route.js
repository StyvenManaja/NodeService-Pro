const express = require('express');
const serviceController = require('../controllers/service.controller');
const authenticateUser = require('../middlewares/authentication');
const serviceValidator = require('../middlewares/service.validator');

const router = express.Router();

router.post('/', authenticateUser, serviceValidator.validateCreateService, serviceController.createService);
router.get('/:serviceID', authenticateUser, serviceController.getServiceById);
router.get('/', authenticateUser, serviceController.getAllServices);
router.put('/:serviceID', authenticateUser, serviceValidator.validateUpdateService, serviceController.updateService);
router.delete('/:serviceID', authenticateUser, serviceController.deleteService);

module.exports = router;
