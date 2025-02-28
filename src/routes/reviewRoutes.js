const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to protect routes
const Chefs = require("../models/chef");

// 📌 Render Review Form (GET)
router.get("/new", authMiddleware, async (req, res) => {
  try {
    const chefs = await Chefs.find(); // Fetch all chefs
    res.render("reviewForm", { chefs, error: null });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Handle Review Form Submission (POST)
router.post("/create", async (req, res) => {
  try {
    const { chef, rating, comment } = req.body;
    const user = req.session.user.id;
    const chefs = await Chefs.find(); // Fetch all chefs
    if (!chef || !rating || !comment) {
      return res.render("chef_profile", { chefs, error: "All fields are required" });
    }
    console.log({ user, chef, rating, comment });
    const review = new Review({ user, chef, rating, comment });
    await review.save();

    res.redirect("/chef/profile"); // Redirect to all reviews page
  } catch (error) {
    res.status(500).json({ error });
  }
});


// 📌 Get all reviews for a specific chef (GET)
router.get("/chef/:chefId", async (req, res) => {
  try {
    const reviews = await Review.find({ chef: req.params.chefId }).populate("user", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
