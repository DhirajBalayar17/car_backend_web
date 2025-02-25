require("dotenv").config();
const Booking = require("../model/Booking");
const Vehicle = require("../model/vehicle");
const User = require("../model/user");

// ✅ Get all bookings (for admin)
const findAll = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: "userId",
                select: "name phone email"
            })
            .populate({
                path: "vehicleId",
                select: "name brand imageUrl pricePerDay"
            })
            .exec();

        console.log("📌 Fetched Bookings:", bookings);
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

// ✅ Check if a vehicle is available for booking
const isVehicleAvailable = async (vehicleId, startDate, endDate) => {
    try {
        console.log(`📌 Checking availability for vehicle: ${vehicleId}`);
        
        const existingBooking = await Booking.findOne({
            vehicleId,
            $or: [
                { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
            ]
        });

        return !existingBooking;
    } catch (error) {
        console.error("❌ Error checking vehicle availability:", error);
        return false;
    }
};

// ✅ Create a new booking
const postData = async (req, res) => {
    try {
        console.log("📌 Received Booking Data:", req.body);

        const { userId, vehicleId, startDate, endDate, totalAmount, paymentMethod, phone } = req.body;

        if (!userId || !vehicleId || !startDate || !endDate || !totalAmount || !phone) {
            console.error("❌ Missing fields:", { userId, vehicleId, startDate, endDate, totalAmount, phone });
            return res.status(400).json({ message: "All fields including phone are required." });
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const userPhone = phone || user.phone;

        const available = await isVehicleAvailable(vehicleId, startDate, endDate);
        if (!available) {
            return res.status(400).json({ message: "Vehicle is already booked for the selected dates." });
        }

        const newBooking = new Booking({
            userId,
            vehicleId,
            startDate,
            endDate,
            phone: userPhone,
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

// ✅ Get bookings by user ID (for user dashboard)
const findByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`📌 Fetching bookings for user: ${userId}`);

        const bookings = await Booking.find({ userId })
            .populate("vehicleId", "name brand imageUrl pricePerDay")
            .populate("userId", "name phone");

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get booking by ID
const findById = async (req, res) => {
    try {
        console.log(`📌 Fetching booking with ID: ${req.params.id}`);

        const booking = await Booking.findById(req.params.id)
            .populate({
                path: "userId",
                select: "name email phone"
            })
            .populate({
                path: "vehicleId",
                select: "name brand imageUrl pricePerDay"
            })
            .select("phone startDate endDate totalAmount paymentMethod status paymentStatus bookingDate")
            .exec();

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        console.log("📌 Booking Found:", booking);
        res.status(200).json(booking);
    } catch (error) {
        console.error("❌ Error fetching booking:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Update booking status or payment status
const update = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        console.log(`📌 Updating booking: ${req.params.id} with data:`, req.body);

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();
        console.log("✅ Booking updated successfully:", booking);
        res.status(200).json({ message: "Booking updated successfully.", booking });
    } catch (error) {
        console.error("❌ Error updating booking:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        console.log(`📌 Cancelling booking with ID: ${req.params.id}`);

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Only pending bookings can be cancelled." });
        }

        booking.status = "cancelled";
        await booking.save();

        console.log("✅ Booking cancelled successfully:", booking);
        res.status(200).json({ message: "Booking cancelled successfully.", booking });
    } catch (error) {
        console.error("❌ Error cancelling booking:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Delete a booking
const deleteById = async (req, res) => {
    try {
        console.log(`📌 Deleting booking with ID: ${req.params.id}`);
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        console.log("✅ Booking deleted successfully.");
        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting booking:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    findAll,
    postData,
    findByUserId,
    findById,
    update,
    cancelBooking, // ✅ Now included!
    deleteById
};
