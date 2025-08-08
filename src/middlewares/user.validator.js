const Joi = require('joi');

// Schema de validation de la création d'un utilisateur
const createUserSchema = Joi.object({
    username: Joi.string().required().min(6).max(30).trim(),
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().min(8).max(100).trim()
});

// Schema de validation de la connexion d'un utilisateur
const connectUserSchema = Joi.object({
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().min(8).max(100).trim()
});

// Middleware générique pour la validation
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map((d) => d.message) });
    }
    next();
}

// Export des middleware spécifiques
module.exports = {
    validateCreateUser: validate(createUserSchema),
    validateConnectUser: validate(connectUserSchema)
};
