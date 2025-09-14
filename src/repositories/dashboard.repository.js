const Clients = require('../models/Clients');
const Prestations = require('../models/Prestations');
const Invoices = require('../models/Invoices');
const Devis = require('../models/Devis');

const getDashboardData = async (userId) => {
    try {
        const clients = await Clients.countDocuments({ user: userId });
        const prestations = await Prestations.countDocuments({ user: userId });
        const invoices = await Invoices.find({ user: userId }).populate('devis');
        const devis = await Devis.countDocuments({ user: userId });

        return {
            clients,
            prestations,
            invoices,
            devis
        };
    } catch (error) {
        throw new Error('DB_ERROR');
    }
};

module.exports = {
    getDashboardData
};
