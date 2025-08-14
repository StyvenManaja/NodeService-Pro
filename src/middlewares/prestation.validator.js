const Joi = require('joi');

// Schema de validation pour la création d'une prestation
const createPrestationSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().min(2).max(500).optional()
});

// Schema de validation pour la mise à jour d'une prestation
const updatePrestationSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    price: Joi.number().min(0).optional(),
    description: Joi.string().min(2).max(500).optional()
});

// Middleware générique de validation
const validateService = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Middleware de validation pour la création d'une prestation
const validateCreatePrestation = validateService(createPrestationSchema);

// Middleware de validation pour la mise à jour d'une prestation
const validateUpdatePrestation = validateService(updatePrestationSchema);

module.exports = {
    validateCreatePrestation,
    validateUpdatePrestation
};
