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

connection();

// Enable CORS for frontend communication
app.use(cors());

// Enable JSON parsing with higher limit for Base64 images
app.use(ex.json({ limit: '50mb' }));
app.use(ex.urlencoded({ extended: true, limit: '50mb' }));

// Register routes
app.get('/', (req, res) => {
    res.send({
        message: 'Food Delivery API is running...',
        database: getStatus() ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'production'
    });
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