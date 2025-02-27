const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Create a new user (POST)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const newUser = new User({ name, email, password, address });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all users (GET)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}, "name email address");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single user by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email address");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a user by ID (GET - Simulating PUT)
router.get("/update/:id", async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, address },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a user by ID (GET - Simulating DELETE)
router.get("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
