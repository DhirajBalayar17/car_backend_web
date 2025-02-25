const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ Authentication Middleware
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No token provided.");
            return res.status(401).json({ success: false, message: "Unauthorized: No token" });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        if (!token) {
            console.error("❌ Invalid token format.");
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token format" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("❌ Invalid or expired token:", err.message);
                return res.status(401).json({ success: false, message: "Unauthorized: Token expired" });
            }

            console.log("✅ Authenticated User:", decoded);
            req.user = decoded; // Attach user to request
            next();
        });
    } catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Admin Middleware
const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ success: false, message: "Forbidden: No user found" });
    }

    if (req.user.role !== "admin") {
        console.error(`❌ Access Denied: ${req.user.username} tried to access admin routes`);
        return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    }

    console.log(`✅ Admin Access Granted: ${req.user.username}`);
    next();
};

module.exports = { authMiddleware, adminMiddleware };
