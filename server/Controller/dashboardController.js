const Order = require('../Schema/orderSchema');
const User = require('../Schema/userSchema');
const Category = require('../Schema/categorySchema');
const Menu = require('../Schema/menuSchema');

const getDashboardStats = async (req, res) => {
    try {
        // Basic Stats
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Recent Orders
        const recentOrders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Revenue Trends (last 6 months - simplified)
        // In a real app, you'd use aggregation. For now, we'll return some static-ish data 
        // derived from actual orders if possible, or formatted for the chart.
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const revenueData = [];

        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            revenueData.push({ name: months[m], revenue: 0, orders: 0 });
        }

        orders.forEach(order => {
            const orderMonth = new Date(order.createdAt).getMonth();
            const monthName = months[orderMonth];
            const dataPoint = revenueData.find(d => d.name === monthName);
            if (dataPoint) {
                dataPoint.revenue += order.totalAmount;
                dataPoint.orders += 1;
            }
        });

        // Popular Categories (Aggregated from items in orders)
        // Popular Categories (Aggregated from items in orders)
        const categories = await Category.find();
        const menuItems = await Menu.find();

        // Create Lookups
        // Map: MenuId -> CategoryId
        const menuCategoryMap = {};
        menuItems.forEach(item => {
            menuCategoryMap[item._id.toString()] = item.category.toString();
        });

        // Map: CategoryId -> CategoryName
        const categoryNameMap = {};
        categories.forEach(cat => {
            categoryNameMap[cat._id.toString()] = cat.name;
        });

        // Initialize Sales Map with all categories (0 sales)
        const categorySalesMap = {};
        categories.forEach(cat => {
            categorySalesMap[cat.name] = 0;
        });

        orders.forEach(order => {
            order.cartItems.forEach(item => {
                // item.id is expected to be the Menu Item ID
                // Check if 'id' or '_id' or however it's stored. orderSchema says 'id'.
                // If item.id matches a menu item
                const menuId = item.id;
                const catId = menuCategoryMap[menuId];

                if (catId) {
                    const catName = categoryNameMap[catId];
                    if (catName) {
                        categorySalesMap[catName] = (categorySalesMap[catName] || 0) + 1; // Counting items sold
                        // Or use quantity: categorySalesMap[catName] += item.quantity;
                    }
                } else {
                    // Fallback if menu item deleted or not found
                    // Maybe log or ignore
                }
            });
        });

        const categoryData = Object.keys(categorySalesMap).map(name => ({
            name: name,
            sales: categorySalesMap[name]
        }));
        // Sort by sales desc
        categoryData.sort((a, b) => b.sales - a.sales);

        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

        res.send({
            success: true,
            data: {
                stats: [
                    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+0%', color: 'bg-green-100 text-green-700' },
                    { title: 'Total Orders', value: totalOrders.toString(), change: '+0%', color: 'bg-blue-100 text-blue-700' },
                    { title: 'Avg Order Value', value: `₹${avgOrderValue}`, change: '+0%', color: 'bg-teal-100 text-teal-700' },
                    { title: 'New Customers', value: totalCustomers.toString(), change: '+0%', color: 'bg-purple-100 text-purple-700' },
                ],
                revenueData,
                categoryData,
                recentOrders: recentOrders.map(order => ({
                    id: `#ORD-${order._id.toString().slice(-4).toUpperCase()}`,
                    customer: order.user ? order.user.name : 'Unknown',
                    items: order.cartItems.map(item => `${item.quantity}x ${item.title}`).join(', '),
                    total: `₹${order.totalAmount}`,
                    status: order.status
                }))
            }
        });

    } catch (err) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: err.message
        });
    }
};

module.exports = { getDashboardStats };
