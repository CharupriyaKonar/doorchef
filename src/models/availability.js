const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Chef", required: true }, // Reference to User model
  availableFrom: { type: Date, required: true },
  availableTo: { type: Date, required: true },
  Mobile: { type: Number, required: true },
});

module.exports = mongoose.model("Availability", availabilitySchema);
