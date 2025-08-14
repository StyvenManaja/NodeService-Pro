const Joi = require('joi');

// Schema de validation pour la création d'un devis
const createQuoteSchema = Joi.object({
    clientId: Joi.string().required(),
    prestationId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').required()
});

// Middleware de validation
const validateCreateQuote = (req, res, next) => {
    const { error } = createQuoteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateCreateQuote
};
