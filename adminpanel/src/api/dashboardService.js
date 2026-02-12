import api from './api';

export const fetchDashboardStats = async () => {
    try {
        const response = await api.get('/api/dashboard-stats');
        console.log("GET /api/dashboard-stats response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { success: false, message: error.message };
    }
};
