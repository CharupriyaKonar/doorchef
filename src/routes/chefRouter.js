const express = require("express");
const router = express.Router();
const Chef = require("../models/chef"); // Import the Chef model
const Availability = require('../models/availability');


// 📌 API to Fetch All Availability Entries
router.get("/availability", async (req, res) => {
  try {
    console.log("availabilities");
    const availabilities = await Availability.find().populate("user"); // Populating user details (if needed)
    res.status(200).json(availabilities);
  } catch (error) {
    console.error("Error fetching availability entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/availability", async (req, res) => {
  try {
    const { availableFrom, availableTo, Mobile } = req.body;

    // Validate required fields
    if (!availableFrom || !availableTo) {
      return res.status(400).json({ error: "Both availableFrom and availableTo are required." });
    }

    // Ensure user is authenticated
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // Create new availability entry
    const availability = new Availability({
      user: req.session.user.id,
      availableFrom,
      availableTo,
      Mobile,
    });

    // Save availability to the database
    await availability.save();

    res.status(201).json({ message: "Availability updated successfully", availability });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Create a new chef (POST)
router.post("/create", async (req, res) => {
  try {
    const { name, email, password, specialty, experience, availability } = req.body;

    // Check if chef already exists
    const existingChef = await Chef.findOne({ email });
    if (existingChef) {
      return res.status(400).json({ error: "Chef with this email already exists." });
    }

    const newChef = new Chef({ name, email, password, specialty, experience, availability });
    await newChef.save();

    res.status(201).json({ message: "Chef created successfully!", chef: newChef });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all chefs (GET)
router.get("/all", async (req, res) => {
  try {
    const chefs = await Chef.find({}, "name email specialty experience availability"); // Exclude password for security
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a single chef by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id, "name email specialty experience availability");
    if (!chef) return res.status(404).json({ error: "Chef not found" });

    res.json(chef);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update a chef by ID (GET) using query parameters
router.get("/update/:id", async (req, res) => {
  try {
    const updates = req.query; // Pass updates via query params
    const updatedChef = await Chef.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedChef) return res.status(404).json({ error: "Chef not found" });

    res.json({ message: "Chef updated successfully!", chef: updatedChef });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Delete a chef by ID (GET)
router.get("/delete/:id", async (req, res) => {
  try {
    const deletedChef = await Chef.findByIdAndDelete(req.params.id);

    if (!deletedChef) return res.status(404).json({ error: "Chef not found" });

    res.json({ message: "Chef deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
