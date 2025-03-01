const express = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controller/AuthController"); // ✅ Correct Path

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // ✅ Added Forgot Password Route
router.post("/reset-password", resetPassword); // ✅ Added Reset Password Route

module.exports = router;
