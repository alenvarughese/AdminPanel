import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchDashboardStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/dashboard-stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};
