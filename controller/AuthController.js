const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ **Register New User**
const register = async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            phone, // ✅ Include phone number
            password: hashedPassword,
            role: role || "user", // Default role to 'user'
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ **Login User (Fixed Missing `userId` and `phone`)**
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role, username: user.username, email: user.email, phone: user.phone },
            SECRET_KEY,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // ✅ **Fixed: Now Including `userId` and `phone` in the response**
        res.json({
            message: "Login successful",
            token,
            userId: user._id, // ✅ Sending userId
            username: user.username,
            email: user.email,
            phone: user.phone, // ✅ Sending phone number
            role: user.role,
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { register, login };
