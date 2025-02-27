const User = require("../models/user");
const Chef = require("../models/chef");
const Admin = require("../models/admin");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const authController = require("./authController");


// User Registration
exports.userRegister = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({ name, email, password: hashedPassword, address });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Chef Registration
exports.chefRegister = async (req, res) => {
  const { name, email, password, specialty, experience, availability } = req.body;
  const resume = req.file.path; // File path from multer
  try {
    // Check if chef already exists
    const existingChef = await Chef.findOne({ email });
    if (existingChef) {
      return res.status(400).json({ message: "Chef already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new chef
    const chef = new Chef({
      name,
      email,
      password: hashedPassword,
      specialty,
      experience,
      availability,
      resume,
    });
    await chef.save();

    res.status(201).json({ message: "Chef registered successfully", chef });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email exists in the User collection
    let user = await User.findOne({ email });
    let role = "users";

    if (!user) {
      // Check if the email exists in the Chef collection
      user = await Chef.findOne({ email });
      role = "chef";
    }

    if (!user) {
      // Check if the email exists in the Admin collection
      user = await Admin.findOne({ email });
      role = "admin";
    }

    // If no user is found in any collection
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store user in session (excluding password for security)
    req.session.user = { id: user._id, name: user.name, email: user.email, role };
    // Send response with role and redirect URL
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role },
      redirect: role === "admin" ? "/admin" : role === "chef" ? "/chef" : "/home",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // Login Route (POST method)
router.post("/login", authController.login);

module.exports = router;
};