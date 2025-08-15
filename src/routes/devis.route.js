const express = require('express');
const devisController = require('../controllers/devis.controller');
const authenticateUser = require('../middlewares/authentication');
const devisValidator = require('../middlewares/devis.validator');

const router = express.Router();

router.post('/', authenticateUser, devisValidator.validateCreateDevis, devisController.createDevis);
router.get('/', authenticateUser, devisController.getAllDevis);

module.exports = router;
