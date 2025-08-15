const express = require('express');
const quoteController = require('../controllers/quote.controller');
const authenticateUser = require('../middlewares/authentication');
const quoteValidator = require('../middlewares/quote.validator');

const router = express.Router();

router.post('/', authenticateUser, quoteValidator.validateCreateQuote, quoteController.createQuote);

module.exports = router;
