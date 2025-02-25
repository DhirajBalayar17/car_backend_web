const express = require("express");
const { findAll, postData, findById, update, deleteById, findByUserId } = require("../controller/BookingController");
const Booking = require("../model/Booking"); // Ensure this model is imported

const router = express.Router();

console.log("✅ Booking Router Loaded");

// ✅ Debug Middleware: Log API calls
router.use((req, res, next) => {
  console.log(`📌 API Called: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Fetch all bookings (for admin)
router.get("/", findAll);

// ✅ Create a new booking
router.post("/", postData);

// ✅ Fetch a single booking by its ID
router.get("/:id", findById);

// ✅ Update a booking
router.put("/:id", update);

// ✅ Delete a booking
router.delete("/:id", deleteById);

// ✅ Fetch bookings for a specific user (Now with populated data)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 Fetching bookings for user: ${userId}`);

    // Fetch bookings where `userId` matches and populate vehicle and user details
    const userBookings = await Booking.find({ userId })
      .populate({
        path: "vehicleId",
        select: "name brand imageUrl pricePerDay"  // ✅ Fetch vehicle details
      })
      .populate({
        path: "userId",
        select: "username phone email"  // ✅ Fetch user details including phone
      });

    if (!userBookings.length) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.json(userBookings);
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
