const express = require('express');
const devisController = require('../controllers/devis.controller');
const authenticateUser = require('../middlewares/authentication');
const devisValidator = require('../middlewares/devis.validator');
const isVerified = require('../middlewares/isVerified');

const router = express.Router();

router.post('/', authenticateUser, isVerified, devisValidator.validateCreateDevis, devisController.createDevis);
router.get('/', authenticateUser, isVerified, devisController.getAllDevis);

module.exports = router;
