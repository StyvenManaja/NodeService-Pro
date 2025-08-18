const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res) => {
    try {
        const data = await dashboardService.getDashboardData();
        if(!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
};

module.exports = {
    getDashboard
};