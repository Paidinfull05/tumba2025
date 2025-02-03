const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

export default async function handler(req, res) {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    if (req.method === "POST") {
        const { username, password } = req.body;

        if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
            const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.json({ token });
        }

        return res.status(403).json({ message: "Invalid credentials" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}
