const express = require("express");
const router = express.Router();
const Transaction = require('../models/payment');

// 📌 API to Process Payment
router.post("/create", async (req, res) => {
  try {
    let { amount, status, dishes } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    // Remove currency symbol if present
    amount = amount.replace("₹", '');
    console.log(amount, req.session.user);

    // Create new transaction
    const transaction = new Transaction({
      user: req.session.user.id,
      amount,
      status: status || "pending",
      dishes
    });

    // Save transaction to database
    await transaction.save();

    res.status(201).json({ message: "Payment transaction created", transaction });
  } catch (error) {
    console.error("Error creating payment transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 API to Fetch All Transactions
router.get("/all", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user", "name email"); // Populating user details
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
