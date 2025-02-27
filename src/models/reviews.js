const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true }, // Reference to Chef (User model)
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reviewer (User model)
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
  comment: { type: String, required: true }, // Review comment
  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model("Review", reviewSchema);
