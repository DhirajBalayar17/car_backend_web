const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();
const ResetPasswordEmail = require("../templates/resetpasswordemail");
const transporter = require("../middleware/mailConfig");
const crypto = require("crypto");
const SECRET_KEY = process.env.JWT_SECRET;

// ✅ **Register New User**
const register = async (req, res) => {
    try {
        const { username, email, phone, password, role } = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: "Welcome to myAfnai Real Estate!",
            html: `<p>Welcome, ${newUser.username}! Your account has been created successfully.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ **Login User**
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, username: user.username, email: user.email, phone: user.phone },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            userId: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ **Forgot Password (Generate Reset Token & Send Email)**
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        const resetToken = jwt.sign(
            { user_id: user._id },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: ResetPasswordEmail({ email: user.email, resetLink }),
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent! Check your email." });
    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ **Reset Password (Set New Password)**
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        console.log("🔹 Received Reset Token:", token);

        if (!token) {
            return res.status(400).json({ error: "Reset token is required" });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            console.error("❌ Token Verification Error:", error.message);
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log("✅ Password reset successful for user:", user.email);

        res.json({ message: "Password reset successful. You can now log in!" });
    } catch (error) {
        console.error("❌ Reset Password Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { register, login, forgotPassword, resetPassword };