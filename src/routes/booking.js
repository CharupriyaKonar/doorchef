const express = require("express");
const router = express.Router();
const Booking = require("./booking");
const Chef = require("../models/chef");
const User = require("../models/user");
const sendBookingEmail = require("../utils/sendEmail");

// Save Booking & Allocate Chef After Payment
router.post("/book", async (req, res) => {
  try {
    const { userId, dishes, totalPrice, allergies, mealTiming, date, venue, contactInfo } = req.body;

    // Save the booking
    const newBooking = new Booking({
      userId,
      dishes,
      totalPrice,
      allergies,
      mealTiming,
      date,
      venue,
      contactInfo,
    });

    await newBooking.save();
    res.status(200).json({ message: "Booking saved. Proceed to payment.", bookingId: newBooking._id });
  } catch (error) {
    res.status(500).json({ error: "Error saving booking" });
  }
});

// Allocate Chef & Send Confirmation Email
router.post("/allocate-chef", async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("userId");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Find an available chef based on dish specialty
    const chef = await Chef.findOne({
      specialty: { $in: booking.dishes.map((dish) => dish.name) },
      availability: true,
    });

    if (!chef) {
      return res.status(400).json({ error: "No available chefs for the selected dishes" });
    }

    // Assign the chef to the booking
    booking.chefId = chef._id;
    booking.status = "Confirmed";
    await booking.save();

    // Mark chef as unavailable
    chef.availability = false;
    await chef.save();

    // Fetch user details
    const user = await User.findById(booking.userId);
    if (user) {
      // Send Confirmation Email
      await sendBookingEmail(user.email, booking, chef);
    }

    res.status(200).json({ message: "Chef allocated successfully. Email sent!", chef });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error allocating chef or sending email" });
  }
});

module.exports = router;
