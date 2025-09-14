const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res, next) => {
    const userId = req.userId;
    try {
        const data = await dashboardService.getDashboardData(userId);
        res.status(200).json({
            status: 'success',
            data: data
        })
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard
};