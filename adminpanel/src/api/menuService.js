import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getMenuItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-menu`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const addMenuItem = async (menuData) => {
    try {
        const response = await axios.post(`${API_URL}/add-menu`, menuData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const deleteMenuItem = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-menu/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const updateMenuItem = async (id, menuData) => {
    try {
        const response = await axios.put(`${API_URL}/update-menu/${id}`, menuData);
        return response.data;
    } catch (error) {
        return { success: false, message: error.message };
    }
};
