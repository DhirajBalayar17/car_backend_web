// const mongoose = require("mongoose");

// const VehicleSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     brand: { type: String, required: true },
//     pricePerDay: { type: Number, required: true },
//     available: { type: Boolean, default: true },
//     image: { type: String, required: true }, // Image URL or file path
//     description: { type: String, required: true } // Short description of the vehicle
// });

// module.exports = mongoose.model("Vehicle", VehicleSchema);
const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    image: { type: String, required: true }, // Image URL or file path
    description: { type: String, required: true } // Short description of the vehicle
});

// ✅ Prevent model overwrite error
module.exports = mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
