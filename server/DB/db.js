let mg = require('mongoose');

let isConnected = false;

let connection = async () => {
    try {
        const url = process.env.MONGODB_URI || "mongodb://localhost:27017/adminboard";
        console.log("Attempting to connect to MongoDB...");
        await mg.connect(url);
        isConnected = true;
        console.log("Database connected successfully");
    } catch (error) {
        isConnected = false;
        console.error("Database connection error:", error);
    }
}

const getStatus = () => isConnected;

module.exports = { connection, getStatus };