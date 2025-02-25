// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDb = require("./config/db");
// const path = require("path");

// // ✅ Import Routes
// const userRouter = require("./router/userRouter");
// const vehicleRouter = require("./router/vehicleRouter");
// const bookingRouter = require("./router/BookingRouter");
// const authRouter = require("./router/authRouter");
// const adminRouter = require("./router/AdminRouter");

// const app = express();

// // ✅ Connect to MongoDB
// connectDb()
//     .then(() => console.log("✅ MongoDB Connected Successfully"))
//     .catch(err => {
//         console.error("❌ MongoDB Connection Error:", err.message);
//         process.exit(1);
//     });

// // ✅ Enable CORS with multiple origins
// app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));

// // ✅ Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Serve Uploaded Images
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 🔥 Fix for serving images

// // ✅ API Routes
// app.use("/api/users", userRouter);
// app.use("/api/vehicles", vehicleRouter);
// app.use("/api/bookings", bookingRouter);
// app.use("/api/auth", authRouter);
// app.use("/api/admin", adminRouter);

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const path = require("path");

// ✅ Import Routes
const userRouter = require("./router/userRouter");
const vehicleRouter = require("./router/vehicleRouter");
const bookingRouter = require("./router/BookingRouter");
const authRouter = require("./router/authRouter");
const adminRouter = require("./router/AdminRouter");

const app = express();
const PORT = process.env.PORT || 5000;

let server; // Store the server instance

// ✅ Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Uploaded Images
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// ✅ API Routes
app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

// ✅ Initialize App (For Testing & Production)
async function initializeApp() {
    if (server) return server; // Prevent multiple server instances

    await connectDb(); // Ensure database is connected

    return new Promise((resolve) => {
        server = app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
            resolve(server);
        });
    });
}

// ✅ Close App (For Testing)
async function closeApp() {
    if (server) {
        server.close(() => {
            console.log("✅ Server closed after tests");
            server = null;
        });
    }
}

// ✅ Start Server Normally (Only if Not in Test Mode)
if (require.main === module) {
    initializeApp();
}

// ✅ Export for Testing
module.exports = { initializeApp, closeApp, app };
