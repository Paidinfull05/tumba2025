require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// User schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    allowed: Boolean,
    lastIP: String,
    lastDevice: String
});
const User = mongoose.model("User", UserSchema);

// Middleware to check token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// ** Fix: Use "/api" for routes **

// Admin login
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }
    res.status(403).json({ message: "Invalid credentials" });
});

// User login
app.post("/api/login", async (req, res) => {
    const { username, password, device, ip } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).json({ message: "Invalid credentials" });
    }

    if (!user.allowed) {
        return res.status(403).json({ message: "Access denied" });
    }

    if (user.lastDevice && user.lastDevice !== device) {
        return res.status(403).json({ message: "Access limited to one device" });
    }

    user.lastIP = ip;
    user.lastDevice = device;
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token, streamUrl: process.env.STREAM_URL });
});

// Admin: Grant/Revoke access
app.post("/api/admin/manage", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const { username, action } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.allowed = action === "grant";
    await user.save();
    res.json({ message: `Access ${action}ed for ${username}` });
});

module.exports = app;
