// const mongoose = require("mongoose");

// const BookingSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
//     phone: { type: String, required: true },  // ✅ Fixed: Renamed `contact` to `phone`
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     totalAmount: { type: Number, required: true },
//     status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
//     paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
//     paymentMethod: { type: String, enum: ["cash", "card", "UPI"], default: "cash" },
//     bookingDate: { type: Date, default: Date.now }
// }, { timestamps: true });

// module.exports = mongoose.model("Booking", BookingSchema);
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    phone: { type: String, required: true },  // ✅ User contact number
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },

    status: { 
        type: String, 
        enum: ["pending", "confirmed", "canceled", "completed"], 
        default: "pending" 
    },  // ✅ Admin approval required

    paymentStatus: { 
        type: String, 
        enum: ["pending", "paid", "failed"], 
        default: "pending" 
    },

    paymentMethod: { 
        type: String, 
        enum: ["cash", "card", "UPI"], 
        default: "cash" 
    },

    bookingDate: { type: Date, default: Date.now },

    // ✅ Added for admin tracking
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },  // Admin who approved
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },  // Admin who rejected

    // ✅ Added to track cancellation reason
    cancellationReason: { type: String, default: null },

    // ✅ Track timestamps
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);

