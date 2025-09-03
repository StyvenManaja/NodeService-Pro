
// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config();

// Initialisation de la connexion à la base de données MongoDB
require('./src/config/db');

// Lance le scheduler
require('./src/config/reminder.cron');


const express = require('express');
const cookieParser = require('cookie-parser'); // Pour parser les cookies
const cors = require('cors');
const app = express();

// Importation des routes
const userRoute = require('./src/routes/user.route');
const clientRoute = require('./src/routes/client.route');
const prestationRoute = require('./src/routes/prestation.route');
const devisRoute = require('./src/routes/devis.route');
const invoiceRoute = require('./src/routes/invoice.route');
const dashboardRoute = require('./src/routes/dashboard.route');
const verificationRoute = require('./src/routes/verification.route');
const subscriptionRoute = require('./src/routes/subscription.route');
const webhookRoute = require('./src/routes/webhook.route');

app.use('/api/webhook/lemonsqueezy', express.raw({ type: 'application/json' }));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour parser les cookies des requêtes HTTP
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use("/api/webhooks/lemonsqueezy", express.raw({ type: "*/*" }));

// Définition du préfixe pour toutes les routes
app.use('/api/users', userRoute);
app.use('/api/clients', clientRoute);
app.use('/api/prestations', prestationRoute);
app.use('/api/devis', devisRoute);
app.use('/api/invoices', invoiceRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/verification', verificationRoute);
app.use('/api/subscription', subscriptionRoute);
app.use('/api/webhook', webhookRoute);

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Export de l'application pour l'utiliser dans server.js
module.exports = app;
