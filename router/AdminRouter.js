const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const {
    getAdminStats,
    getAllUsers,
    promoteToAdmin,
    updateUser,  // ✅ Added update route
    deleteUser
} = require("../controller/AdminController");

const router = express.Router();

// ✅ Middleware Logger
router.use((req, res, next) => {
    console.log(`🔹 Admin API Called: ${req.method} ${req.originalUrl} by ${req.user?.username || "Unknown User"}`);
    next();
});

// ✅ Fetch Admin Dashboard Statistics
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

// ✅ User Management Routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUser); // ✅ Added update user route
router.put("/users/:id/promote", authMiddleware, adminMiddleware, promoteToAdmin);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;











