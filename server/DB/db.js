let mg = require('mongoose');

let connection = async () => {
    try {
        const url = process.env.MONGODB_URI || "mongodb://localhost:27017/adminboard";
        await mg.connect(url);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connection;