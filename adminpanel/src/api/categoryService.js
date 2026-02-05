const API_URL = 'http://localhost:5000/api';

export const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { success: false, message: 'Server connection error' };
        }
    },

    addCategory: async (categoryData) => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding category:', error);
            return { success: false, message: 'Server connection error' };
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, message: 'Server connection error' };
        }
    }
};
