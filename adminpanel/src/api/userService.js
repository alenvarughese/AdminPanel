import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const userAPI = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Delete a user
    deleteUser: async (userId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/users/${userId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }
};
