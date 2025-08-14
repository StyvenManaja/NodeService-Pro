
// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config();

// Initialisation de la connexion à la base de données MongoDB
require('./src/config/db');


const express = require('express');
const cookieParser = require('cookie-parser'); // Pour parser les cookies
const app = express();

// Importation des routes
const userRoute = require('./src/routes/user.route');
const customerRoute = require('./src/routes/customer.route');


// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour parser les cookies des requêtes HTTP
app.use(cookieParser());

// Définition du préfixe pour toutes les routes
app.use('/api/users', userRoute);
app.use('/api/customers', customerRoute);

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Export de l'application pour l'utiliser dans server.js
module.exports = app;
