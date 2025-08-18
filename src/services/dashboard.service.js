const dashboardRepository = require('../repositories/dashboard.repository');

const getDashboardData = async () => {
    try {
        const data = await dashboardRepository.getDashboardData();

        if(!data) {
            throw new Error('No data found');
        }

        // Montant total facturé
        const invoices = data.invoices || [];
        let totalAmount = 0;
        invoices.forEach(invoice => {
            totalAmount += invoice.devis.totalAmount || 0;
        });

        return {
            clients: data.clients,
            prestations: data.prestations,
            totalFacture: totalAmount,
            devis: data.devis
        };
    } catch (error) {
        throw new Error('Error fetching dashboard data: ' + error.message);
    }
};

module.exports = {
    getDashboardData
};
