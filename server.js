
// Importation de l'application Express principale
const app = require('./app');

// Définition du port d'écoute (par défaut 3000 si non défini dans les variables d'environnement)
const PORT = process.env.PORT || 3000;

// Démarrage du serveur HTTP
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
