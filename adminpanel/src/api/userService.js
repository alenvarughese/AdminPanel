import api from './api';

export const userAPI = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get('/api/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // Delete a user
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
        try {
            const response = await api.patch(`/api/users/${userId}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }
};
