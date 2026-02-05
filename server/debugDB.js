const mongoose = require('mongoose');
const fs = require('fs');
const Category = require('./Schema/categorySchema');
const Menu = require('./Schema/menuSchema');

async function debugDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/adminboard');

        const categories = await Category.find().lean();
        const menuItems = await Menu.find().lean();

        const results = {
            categoriesCount: categories.length,
            menuItemsCount: menuItems.length,
            details: []
        };

        for (const cat of categories) {
            const count = await Menu.countDocuments({ category: cat._id });
            results.details.push({
                name: cat.name,
                id: cat._id.toString(),
                itemCount: count
            });
        }

        if (menuItems.length > 0) {
            results.sampleMenuItem = {
                name: menuItems[0].name,
                categoryRef: menuItems[0].category.toString(),
                categoryType: typeof menuItems[0].category
            };
        }

        fs.writeFileSync('debug_results.json', JSON.stringify(results, null, 2));
        console.log("Results written to debug_results.json");
        process.exit(0);
    } catch (err) {
        console.error("Debug failed:", err);
        process.exit(1);
    }
}

debugDB();
