const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./model/Users');
require('dotenv').config(); // Load environment variables

const app = express();

// ✅ CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "");
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}
connectDB(); // Connect to DB

// ✅ Test Route
app.get('/', (req, res) => {
    res.send("🚀 Server is running on Render..!");
});

// ✅ GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ CREATE a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = await UserModel.create(req.body);
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ UPDATE user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, email: req.body.email, age: req.body.age },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Start the server (REQUIRED for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
