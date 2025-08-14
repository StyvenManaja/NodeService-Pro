const Joi = require('joi');

// Schéma de validation pour la création d'utilisateur
const createClientSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    company: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(6).required()
});

// Schéma de validation pour la mise à jour d'utilisateur
const updateClientSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    company: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(15).optional()
});

// Middleware générique pour la validation
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            details: error.details
        });
    }
    next();
}

// Export des middlewares spécifique
module.exports = {
    validateCreateClient: validate(createClientSchema),
    validateUpdateClient: validate(updateClientSchema)
};
