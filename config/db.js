const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/db_car_rental_management_system");
        console.log("MongoDB Connected");
    } catch (e) {
        console.log("MongoDB connection error:", e.message);
    }
}

module.exports = connectDB;
