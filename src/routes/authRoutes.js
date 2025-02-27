const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");
router.post("/login", authController.login);

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// User Registration
router.post("/user/register", authController.userRegister);

// Chef Registration
router.post("/chef/register", upload.single("resume"), authController.chefRegister);

// Login
router.post("/login", authController.login);

module.exports = router;