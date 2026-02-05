const Menu = require('../Schema/menuSchema');

const addMenuItem = async (req, res) => {
    try {
        const { name, description, category, price, image } = req.body;

        if (!name || !category || !price) {
            return res.send({
                success: false,
                message: "Name, category, and price are required"
            });
        }

        const newMenuItem = new Menu({
            name,
            description,
            category,
            price,
            image
        });

        await newMenuItem.save();

        res.send({
            success: true,
            message: "Menu item added successfully",
            data: newMenuItem
        });
    } catch (err) {
        console.error("Error adding menu item:", err);
        res.send({
            success: false,
            message: "Failed to add menu item",
            data: err.message
        });
    }
};

const getMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find().populate('category');
        res.send({
            success: true,
            message: "Menu items retrieved successfully",
            data: menuItems
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to retrieve menu items",
            data: err.message
        });
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        await Menu.findByIdAndDelete(id);
        res.send({
            success: true,
            message: "Menu item deleted successfully"
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to delete menu item",
            data: err.message
        });
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, image } = req.body;

        const updatedItem = await Menu.findByIdAndUpdate(
            id,
            { name, description, category, price, image },
            { new: true }
        ).populate('category');

        res.send({
            success: true,
            message: "Menu item updated successfully",
            data: updatedItem
        });
    } catch (err) {
        console.error("Error updating menu item:", err);
        res.send({
            success: false,
            message: "Failed to update menu item",
            data: err.message
        });
    }
};

module.exports = { addMenuItem, getMenuItems, deleteMenuItem, updateMenuItem };
