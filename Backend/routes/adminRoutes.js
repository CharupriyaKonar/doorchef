const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/dashboard", authMiddleware, (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json("Unauthorized");
  }
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
