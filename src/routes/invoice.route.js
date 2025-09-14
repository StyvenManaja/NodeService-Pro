const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const authenticateUser = require('../middlewares/authentication');
const { validateInvoice } = require('../middlewares/invoice.validator');
const isVerified = require('../middlewares/isVerified');
const verifySubscription = require('../middlewares/verifySubscription');

const router = express.Router();

router.post('/:devisId', authenticateUser, isVerified, verifySubscription, validateInvoice, invoiceController.createInvoice);
router.get('/:invoiceId', authenticateUser, isVerified, verifySubscription, invoiceController.getInvoiceById);
router.get('/', authenticateUser, isVerified, verifySubscription, invoiceController.getAllInvoices);
router.post('/:invoiceId/pay', authenticateUser, isVerified, verifySubscription, invoiceController.payInvoice);

module.exports = router;
