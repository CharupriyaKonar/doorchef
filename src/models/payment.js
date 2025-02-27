const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Reference to User model
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  date: { type: Date, default: Date.now },
  dishes: { type: [String], default: [] } // Array of dish names or IDs
});

module.exports = mongoose.model("Transaction", transactionSchema);
