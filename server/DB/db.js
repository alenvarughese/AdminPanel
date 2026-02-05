let mg = require('mongoose');

let connection = async() => {
    try {
        await mg.connect("mongodb://localhost:27017/adminboard")
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connection;