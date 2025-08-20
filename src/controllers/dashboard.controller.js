const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res) => {
    const userId = req.userId;
    try {
        const data = await dashboardService.getDashboardData(userId);
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