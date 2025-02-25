const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  availability: { type: String, required: true },
  resume: { type: String, required: true }, // File path or URL
});

module.exports = mongoose.model("chefs", chefSchema);