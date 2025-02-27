const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/usersRouts");
const chefRoutes = require("./src/routes/chefRouter");
const createAdmin = require("./src/utils/createAdmin");
const paymentRoutes = require("./src/routes/paymentRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const authMiddleware = require('./src/middleware/authMiddleware')

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

// Set the view engine to EJS
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Configure session middleware
app.use(
  session({
    secret: "sessionSecret", // Change this to a strong, random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dish/", bookingRoutes);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    res.redirect('login');
  });
});

app.get("/chef/login",(req,res)=>{
  return res.render('chef_login');
});

app.get("/login",(req,res)=>{
  return res.render('login');
});

app.get("/home",authMiddleware,(req,res)=>{
  return res.render('index');
});

app.get("/payment",authMiddleware,(req,res)=>{
  return res.render('payment');
});

app.get("/admin",authMiddleware,(req,res)=>{
  return res.render('admin');
});

app.get("/chef",authMiddleware,(req,res)=>{
  return res.render('chef_portal');
});

app.get("/about",authMiddleware,(req,res)=>{
  return res.render('about');
});

app.get("/menu",authMiddleware,(req,res)=>{
  return res.render('menu');
});

app.get("/contact",authMiddleware,(req,res)=>{
  return res.render('contact');
});

app.get("/chef/profile",authMiddleware,(req,res)=>{
  return res.render('chef_profile');
});

app.get("/chef/dashboard",authMiddleware,(req,res)=>{
  return res.render('chef_portal');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
