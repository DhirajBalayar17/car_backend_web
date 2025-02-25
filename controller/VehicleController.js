require("dotenv").config();
const Vehicle = require("../model/vehicle");
const multer = require("multer");
const path = require("path");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store images in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    }
});

const upload = multer({ storage: storage });

// Get all vehicles
const findAll = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        const vehiclesWithImageUrls = vehicles.map(vehicle => ({
            ...vehicle.toObject(),
            imageUrl: `http://localhost:3000/${vehicle.image}`, // Full image URL
        }));
        res.status(200).json(vehiclesWithImageUrls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching vehicles", error });
    }
};

// Save new vehicle with image
const postData = async (req, res) => {
    try {
        const { userId, vehicleId, startDate, endDate, totalAmount, paymentMethod, contact } = req.body;
        console.log("📌 Received Booking Data:", req.body);

        if (!userId || !vehicleId || !startDate || !endDate || !totalAmount || !contact) {
            return res.status(400).json({ message: "All fields including contact are required." });
        }

        // ✅ Check if vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found." });
        }

        // ✅ Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Check if vehicle is available for the selected dates
        const available = await isVehicleAvailable(vehicleId, startDate, endDate);
        if (!available) {
            return res.status(400).json({ message: "Vehicle is already booked for the selected dates." });
        }

        // ✅ Create a new booking with provided contact details
        const newBooking = new Booking({
            userId,
            vehicleId,
            startDate,
            endDate,
            contact, // ✅ Store user-provided contact
            totalAmount,
            paymentMethod,
            status: "pending",
            paymentStatus: "pending",
            bookingDate: new Date(),
        });

        await newBooking.save();
        console.log("✅ Booking created successfully:", newBooking);

        res.status(201).json({ message: "Booking created successfully.", booking: newBooking });
    } catch (error) {
        console.error("❌ Error creating booking:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get vehicle by ID
const findById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({
            ...vehicle.toObject(),
            imageUrl: `http://localhost:3000/${vehicle.image}`, // Full image URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching vehicle", error });
    }
};

// Delete vehicle by ID
const deleteById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting vehicle", error });
    }
};

// Update vehicle details
const update = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json({ message: "Vehicle updated successfully", vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating vehicle", error });
    }
};

module.exports = {
    findAll,
    postData,
    findById,
    deleteById,
    update,
    upload // Export upload middleware for routes
};
