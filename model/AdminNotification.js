const mongoose = require("mongoose");

const AdminNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Notification Title
    message: { type: String, required: true }, // Detailed message
    type: { type: String, enum: ["info", "warning", "error"], default: "info" }, // Type of notification
    createdAt: { type: Date, default: Date.now }, // Time of notification
    status: { type: String, enum: ["unread", "read"], default: "unread" }, // Mark as read/unread
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }, // Link to the related booking
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Link to the user who triggered the notification
});

module.exports = mongoose.model("AdminNotification", AdminNotificationSchema);
