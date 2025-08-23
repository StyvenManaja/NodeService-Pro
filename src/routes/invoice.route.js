const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const authenticateUser = require('../middlewares/authentication');
const { validateInvoice } = require('../middlewares/invoice.validator');
const isVerified = require('../middlewares/isVerified');

const router = express.Router();

router.post('/:devisId', authenticateUser, isVerified, validateInvoice, invoiceController.createInvoice);
router.get('/', authenticateUser, isVerified, invoiceController.getAllInvoices);
router.post('/:invoiceId/pay', authenticateUser, isVerified, invoiceController.payInvoice);

module.exports = router;
