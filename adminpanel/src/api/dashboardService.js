import api from './api';

export const fetchDashboardStats = async () => {
    try {
        const response = await api.get('/api/dashboard-stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};
