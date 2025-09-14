const dashboardRepository = require('../repositories/dashboard.repository');
const AppError = require('../utils/AppError');

const getDashboardData = async (userId) => {
    try {
        const data = await dashboardRepository.getDashboardData(userId);

        if(!data) {
            throw new AppError('No data found', 404);
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
        throw new AppError('Error on getting dashboard data', 500);
    }
};

module.exports = {
    getDashboardData
};
