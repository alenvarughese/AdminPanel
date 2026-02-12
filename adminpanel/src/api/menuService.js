import api from './api';

export const getMenuItems = async () => {
    try {
        const response = await api.get('/get-menu');
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const addMenuItem = async (menuData) => {
    try {
        const response = await api.post('/add-menu', menuData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteMenuItem = async (id) => {
    try {
        const response = await api.delete(`/delete-menu/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateMenuItem = async (id, menuData) => {
    try {
        const response = await api.put(`/update-menu/${id}`, menuData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};
