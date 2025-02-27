const mongoose = require("mongoose");

const ChefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  specialty: [{ type: String, required: true }], // Example: ["Chinese", "Italian"]
  experience: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  resume: { type: String, default: '' },
});

module.exports = mongoose.model("Chef", ChefSchema);
