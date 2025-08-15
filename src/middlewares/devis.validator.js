const Joi = require('joi');

// Schema de validation pour la création d'un devis
const createDevisSchema = Joi.object({
    client: Joi.string().required(),
    prestations: Joi.array().items(
        Joi.alternatives().try(
            Joi.object({
                prestation: Joi.string().required(),
                quantity: Joi.number().min(1).default(1)
            }),
            Joi.string() // Permet aussi un ID simple
        )
    ).required(),
    validityPeriod: Joi.number().min(1).default(30)
});

// Middleware de validation
const validateCreateDevis = (req, res, next) => {
    const { error } = createDevisSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateCreateDevis
};
