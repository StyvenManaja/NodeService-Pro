
// Importation du module mongoose pour gérer la connexion à MongoDB
const mongoose = require('mongoose');

// Connexion à la base de données MongoDB avec l'URI stockée dans les variables d'environnement
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Utilise le nouvel analyseur d'URL MongoDB
    useUnifiedTopology: true, // Utilise le nouveau moteur de gestion des connexions
});

// Récupération de la connexion active
const db = mongoose.connection;

// Gestion des erreurs de connexion
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Confirmation de la connexion réussie
db.once('open', () => {
    console.log('Connected to MongoDB database.');
});

// Export de la connexion pour une utilisation ailleurs dans l'application
module.exports = db;