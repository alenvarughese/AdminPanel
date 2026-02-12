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

// Robust CORS Configuration
// The cors middleware handles OPTIONS preflights automatically when used with app.use()
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Enable JSON parsing
app.use(ex.json({ limit: '50mb' }));
app.use(ex.urlencoded({ extended: true, limit: '50mb' }));

// Request Logger
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        console.log(`[${timestamp}] Body:`, req.body ? Object.keys(req.body) : 'No Body');
    }
    next();
});

// Root Diagnostic
app.get('/', (req, res) => {
    res.send({
        message: 'Food Delivery API is running...',
        database: getStatus() ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Full Diagnostics
app.get('/diagnostics', async (req, res) => {
    try {
        const counts = {
            categories: await Category.countDocuments(),
            menuItems: await Menu.countDocuments(),
            users: await User.countDocuments(),
            orders: await Order.countDocuments()
        };

        const categoriesList = await Category.find({}, { name: 1 });

        res.send({
            success: true,
            status: 'Diagnostic Report',
            database: getStatus() ? 'Connected' : 'Disconnected',
            counts,
            categories: categoriesList.map(c => c.name),
            env: {
                has_mongo_uri: !!process.env.MONGODB_URI,
                port: process.env.PORT || 5000
            }
        });
    } catch (err) {
        console.error('Diagnostic error:', err);
        res.status(500).send({ success: false, error: err.message });
    }
});

// Routes
app.use(userRoute);
app.use(categoryRoute);
app.use(menuRoute);
app.use(orderRoute);
app.use(dashboardRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).send({ success: false, message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});