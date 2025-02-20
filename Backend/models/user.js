const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "chef", "admin"], default: "user" },
  specialty: { type: String, required: function() { return this.role === "chef"; } }, 
  experience: { type: Number, required: function() { return this.role === "chef"; } },
  availability: { type: String, required: function() { return this.role === "chef"; } },
  resume: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
