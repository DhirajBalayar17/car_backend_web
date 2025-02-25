const Booking = require("../model/Booking");
const User = require("../model/user");
const Vehicle = require("../model/vehicle");  

// ✅ Get Admin Dashboard Statistics
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalCars = await Vehicle.countDocuments();
        const totalBookings = await Booking.countDocuments();

        res.status(200).json({
            success: true,
            totalUsers,
            totalAdmins,
            totalCars,
            totalBookings,
        });
    } catch (error) {
        console.error("❌ Error fetching admin stats:", error);
        res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
    }
};

// ✅ Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
};

// ✅ Promote a User to Admin
const promoteToAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "❌ User not found." });

        user.role = "admin"; 
        await user.save();
        res.status(200).json({ success: true, message: "✅ User promoted to admin.", user });
    } catch (error) {
        console.error("❌ Error promoting user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// ✅ Update User Details (NEW)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, role } = req.body;

        console.log(`📌 Updating user: ${id} with data:`, req.body);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "❌ User not found." });
        }

        // ✅ Update Fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone; 
        if (role) user.role = role;

        await user.save();

        res.status(200).json({ success: true, message: "✅ User updated successfully.", user });
    } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "❌ User not found." });

        res.status(200).json({ success: true, message: "✅ User deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    promoteToAdmin,
    updateUser,  // ✅ NEW: Added update function
    deleteUser,
};
