const Joi = require('joi');

// Schema de validation pour la vérification de l'utilisateur
const verificationSchema = Joi.object({
  code: Joi.number().integer().min(100000).max(999999).required()
});

// Middleware de validation
const validateVerification = (req, res, next) => {
  const { error } = verificationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateVerification;
