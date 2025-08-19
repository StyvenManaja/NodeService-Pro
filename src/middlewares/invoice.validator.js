const Joi = require('joi');

// Schema de validation pour une facture
const invoiceSchema = Joi.object({
    dueDate: Joi.date().greater('now').required(),
});

// Middleware de validation
const validateInvoice = (req, res, next) => {
    const { error } = invoiceSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateInvoice
};
