let ex = require('express');
let app = ex();
let cors = require('cors');
let connection = require('./DB/db');
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
app.use(userRoute);
app.use(categoryRoute);
app.use(menuRoute);
app.use(orderRoute);
app.use(dashboardRoute);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});