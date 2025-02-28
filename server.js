const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Chef = require("./src/models/chef");
const session = require('express-session');
const Review = require("./src/models/reviews");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/usersRouts");
const chefRoutes = require("./src/routes/chefRouter");
const createAdmin = require("./src/utils/createAdmin");
const reviewRoutes = require("./src/routes/reviewRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const authMiddleware = require('./src/middleware/authMiddleware');

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

// Set the view engine to EJS
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect("mongodb://127.0.0.1/test")
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
  
 //
 // createAdmin();
app.use("/reviews/", reviewRoutes);
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

app.get("/home",(req,res)=>{
  return res.render('index',{user:req.session.user || ''});
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

app.get("/about",(req,res)=>{
  return res.render('about',{user:req.session.user || ''});
});

app.get("/menu",authMiddleware,(req,res)=>{
  return res.render('menu');
});

app.get("/contact",authMiddleware,(req,res)=>{
  return res.render('contact');
});

const getChefReviews = async () => {
  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "chefs",
        localField: "chef",
        foreignField: "_id",
        as: "chefDetails"
      }
    },
    {
      $unwind: "$chefDetails"
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    {
      $unwind: "$userDetails"
    },
    {
      $group: {
        _id: "$chefDetails.name",
        reviews: {
          $push: {
            user: "$userDetails.name",
            rating: {
              $switch: {
                branches: [
                  { case: { $eq: ["$rating", 5] }, then: "⭐⭐⭐⭐⭐" },
                  { case: { $eq: ["$rating", 4] }, then: "⭐⭐⭐⭐" },
                  { case: { $eq: ["$rating", 3] }, then: "⭐⭐⭐" },
                  { case: { $eq: ["$rating", 2] }, then: "⭐⭐" },
                  { case: { $eq: ["$rating", 1] }, then: "⭐" }
                ],
                default: "⭐"
              }
            },
            review: "$comment"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        chefName: "$_id",
        reviews: 1
      }
    }
  ]);

  // Transform array to object format
  const result = reviews.reduce((acc, curr) => {
    acc[curr.chefName] = curr.reviews;
    return acc;
  }, {});
  return result;
};


app.get("/chef/profile",authMiddleware, async (req,res)=>{
  let error = '';
  let ratings = await getChefReviews();
  try {
    const chefs = await Chef.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "chef",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          specialty: 1,
          experience: 1,
          availability: 1,
          resume: 1,
          averageRating: { $round: ["$averageRating", 1] }, // Round to 1 decimal place
        },
      },
    ]);
    console.log(ratings);
    return res.render('chef_profile',{chefs,ratings,error,user:req.session.user || ''});
  } catch (error) {
    console.error("Error fetching chefs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/chef/dashboard",authMiddleware,(req,res)=>{
  return res.render('chef_portal');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
