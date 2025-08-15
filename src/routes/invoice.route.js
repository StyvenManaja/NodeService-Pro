const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const authenticateUser = require('../middlewares/authentication');

const router = express.Router();

router.post('/:devisId', authenticateUser, invoiceController.createInvoice);
router.get('/', authenticateUser, invoiceController.getAllInvoices);

module.exports = router;
