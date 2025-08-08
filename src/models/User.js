
// Importation de mongoose pour la gestion des schémas et de la base MongoDB
const mongoose = require('mongoose');
// Importation de bcryptjs pour le hashage des mots de passe
const bcrypt = require('bcryptjs');


// Définition du schéma utilisateur avec validation et contraintes
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Champ obligatoire
        unique: true,   // Doit être unique
        trim: true,     // Supprime les espaces en début/fin
        minlength: 6    // Longueur minimale
    },
    email: {
        type: String,
        required: true, // Champ obligatoire
        unique: true,   // Doit être unique
        trim: true,     // Supprime les espaces
        lowercase: true // Convertit en minuscules
    },
    password: {
        type: String,
        required: true, // Champ obligatoire
        minlength: 8    // Longueur minimale
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});


// Middleware Mongoose : hash le mot de passe avant chaque sauvegarde si modifié
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// Méthode d'instance pour comparer un mot de passe fourni avec le hash stocké
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


// Export du modèle User pour l'utiliser dans toute l'application
module.exports = mongoose.model('User', userSchema);