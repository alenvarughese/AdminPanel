require('dotenv').config();
let ex = require('express');
let app = ex();
let cors = require('cors');
let { connection, getStatus } = require('./DB/db');
let userRoute = require('./Routes/userRoute');
let categoryRoute = require('./Routes/categoryRoute');
let menuRoute = require('./Routes/menuRoute');
let orderRoute = require('./Routes/orderRoute');
let dashboardRoute = require('./Routes/dashboardRoute');

const Category = require('./Schema/categorySchema');
const Menu = require('./Schema/menuSchema');
const User = require('./Schema/userSchema');
const Order = require('./Schema/orderSchema');

connection();

// Enable CORS for frontend communication
app.use(cors());

// Enable JSON parsing with higher limit for Base64 images
app.use(ex.json({ limit: '50mb' }));
app.use(ex.urlencoded({ extended: true, limit: '50mb' }));

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
        console.log('Body Keys:', Object.keys(req.body));
    }
    next();
});

// Register routes
app.get('/', (req, res) => {
    res.send({
        message: 'Food Delivery API is running...',
        database: getStatus() ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'production'
    });
});

// Diagnostics Route
app.get('/diagnostics', async (req, res) => {
    try {
        const catCount = await Category.countDocuments();
        const menuCount = await Menu.countDocuments();
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();

        const cats = await Category.find({}, { name: 1 });

        res.send({
            success: true,
            database: getStatus() ? 'Connected' : 'Disconnected',
            counts: {
                categories: catCount,
                menuItems: menuCount,
                users: userCount,
                orders: orderCount
            },
            categories: cats.map(c => c.name)
        });
    } catch (err) {
        res.status(500).send({ success: false, error: err.message });
    }
});

app.use(userRoute);
app.use(categoryRoute);
app.use(menuRoute);
app.use(orderRoute);
app.use(dashboardRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});