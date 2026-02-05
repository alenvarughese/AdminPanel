const Category = require('../Schema/categorySchema');
const Menu = require('../Schema/menuSchema');

const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.send({
                success: false,
                message: "Category name is required"
            });
        }

        const newCategory = new Category({ name });
        await newCategory.save();

        res.send({
            success: true,
            message: "Category added successfully",
            data: newCategory
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.code === 11000 ? "Category already exists" : "Failed to add category",
            data: err.message
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().lean();

        // Add itemCount to each category
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await Menu.countDocuments({ category: cat._id });
            console.log(`Category: ${cat.name}, ID: ${cat._id}, Count: ${count}`);
            return { ...cat, itemCount: count };
        }));

        console.log("Categories with counts:", categoriesWithCount);

        res.send({
            success: true,
            message: "Categories retrieved successfully",
            data: categoriesWithCount
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to retrieve categories",
            data: err.message
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Cascading delete: Remove all menu items in this category
        await Menu.deleteMany({ category: id });

        await Category.findByIdAndDelete(id);

        res.send({
            success: true,
            message: "Category and associated items deleted successfully"
        });
    } catch (err) {
        res.send({
            success: false,
            message: "Failed to delete category",
            data: err.message
        });
    }
};

module.exports = { addCategory, getCategories, deleteCategory };
