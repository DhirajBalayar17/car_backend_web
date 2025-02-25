require("dotenv").config();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get all users (excluding passwords)
const findAll = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error.message);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Register new user
const postData = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        if (!username || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: role === "admin" ? "admin" : "user", // Ensure proper role assignment
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("❌ Error registering user:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get user by ID (excluding password)
const findById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Delete user by ID (Admins Only, Cannot Delete Themselves)
const deleteById = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const userIdToDelete = req.params.id;

        // Verify if requester is admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized: Only admins can delete users" });
        }

        // Prevent admin from deleting themselves
        if (adminId === userIdToDelete) {
            return res.status(403).json({ message: "Admins cannot delete their own account!" });
        }

        // Find and delete user
        const user = await User.findByIdAndDelete(userIdToDelete);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error.message);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// Update user details (Edit Profile)
const update = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;  // Include role in the body
        const userId = req.params.id;
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        if (decoded.userId !== userId && decoded.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized to update this profile" });
        }

        // Find existing user
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            existingUser.email = email;
        }

        if (username) existingUser.username = username;
        if (phone) existingUser.phone = phone; // Update phone number
        if (role) existingUser.role = role;  // Update the role

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            existingUser.password = await bcrypt.hash(password, 10);
        }

        await existingUser.save();
        res.status(200).json({ message: "Profile updated successfully", user: existingUser });
    } catch (error) {
        console.error("❌ Error updating user:", error.message);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

module.exports = { findAll, postData, findById, deleteById, update };
