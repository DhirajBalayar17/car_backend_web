const express = require("express");
const router = express.Router();
const { findAll, postData, findById, update, deleteById, upload } = require("../controller/VehicleController");

// Vehicle API Routes
router.get("/", findAll);
router.post("/", upload.single("image"), postData); // Upload image while adding a vehicle
router.get("/:id", findById);
router.put("/:id", update);
router.delete("/:id", deleteById);

module.exports = router;
