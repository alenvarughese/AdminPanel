import api from './api';

export const getMenuItems = async () => {
    try {
        const response = await api.get('/get-menu');
        console.log("GET /get-menu response:", response.data);
        return response.data;
    } catch (error) {
        console.error("GET /get-menu error:", error);
        return { success: false, message: error.message };
    }
};

export const addMenuItem = async (menuData) => {
    try {
        const response = await api.post('/add-menu', menuData);
        console.log("POST /add-menu response:", response.data);
        return response.data;
    } catch (error) {
        console.error("POST /add-menu error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteMenuItem = async (id) => {
    try {
        const response = await api.delete(`/delete-menu/${id}`);
        console.log(`DELETE /delete-menu/${id} response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`DELETE /delete-menu/${id} error:`, error);
        return { success: false, message: error.message };
    }
};

export const updateMenuItem = async (id, menuData) => {
    try {
        const response = await api.put(`/update-menu/${id}`, menuData);
        console.log(`PUT /update-menu/${id} response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`PUT /update-menu/${id} error:`, error);
        return { success: false, message: error.message };
    }
};
