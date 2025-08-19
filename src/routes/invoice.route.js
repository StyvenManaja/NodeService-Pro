const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const authenticateUser = require('../middlewares/authentication');
const { validateInvoice } = require('../middlewares/invoice.validator');

const router = express.Router();

router.post('/:devisId', authenticateUser, validateInvoice, invoiceController.createInvoice);
router.get('/', authenticateUser, invoiceController.getAllInvoices);
router.post('/:invoiceId/pay', authenticateUser, invoiceController.payInvoice);

module.exports = router;
