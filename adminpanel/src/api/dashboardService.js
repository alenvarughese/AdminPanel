import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard-stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};
