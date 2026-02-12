import api from './api';

export const userAPI = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get('/api/users');
            console.log("GET /api/users response:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return { success: false, message: error.message };
        }
    },

    // Delete a user
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/api/users/${userId}`);
            console.log(`DELETE /api/users/${userId} response:`, response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, message: error.message };
        }
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
        try {
            const response = await api.patch(`/api/users/${userId}/status`, { status });
            console.log(`PATCH /api/users/${userId}/status response:`, response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating user status:', error);
            return { success: false, message: error.message };
        }
    }
};
