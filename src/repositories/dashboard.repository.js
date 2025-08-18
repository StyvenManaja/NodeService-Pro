const Clients = require('../models/Clients');
const Prestations = require('../models/Prestations');
const Invoices = require('../models/Invoices');
const Devis = require('../models/Devis');

const getDashboardData = async () => {
    try {
        const clients = await Clients.countDocuments();
        const prestations = await Prestations.countDocuments();
        const invoices = await Invoices.find().populate('devis');
        const devis = await Devis.countDocuments();

        return {
            clients,
            prestations,
            invoices,
            devis
        };
    } catch (error) {
        throw new Error('Error fetching dashboard data: ' + error.message);
    }
};

module.exports = {
    getDashboardData
};
