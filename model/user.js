const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {  // ✅ Added phone number field
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: { 
    type: String,
    required: true,
  },
  role: { 
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt automatically

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
