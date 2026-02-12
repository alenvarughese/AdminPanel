import api from './api';

export const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await api.get('/api/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { success: false, message: 'Server connection error' };
        }
    },

    addCategory: async (categoryData) => {
        try {
            const response = await api.post('/api/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            return { success: false, message: 'Server connection error' };
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`/api/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, message: 'Server connection error' };
        }
    }
};
