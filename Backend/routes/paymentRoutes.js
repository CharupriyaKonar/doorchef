const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/booking");
const Chef = require("../models/chef");
const { sendBookingConfirmation } = require("../utils/sendEmail");

// 📌 API to Process Payment
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, email, dishName, location, bookingTime, totalAmount } = req.body;

    // Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: dishName },
            unit_amount: totalAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/DoorChef/pages/confirmation.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/DoorChef/pages/payment.html",
      metadata: { userId, email, dishName, location, bookingTime },
    });

    res.json({ sessionId: session.id });

  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
});

// 📌 API to Confirm Payment & Allocate Chef
router.post("/confirm-payment", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed!" });
    }

    const { userId, email, dishName, location, bookingTime } = session.metadata;

    // Find an available chef
    const chef = await Chef.findOne({ specialty: dishName, isAvailable: true, location });

    if (!chef) {
      return res.status(404).json({ message: "No available chefs" });
    }

    // Create booking in DB
    const booking = new Booking({
      userId,
      email,
      dishName,
      location,
      bookingTime,
      paymentStatus: "success",
      chefId: chef._id,
      chefName: chef.name,
      chefPhone: chef.phone,
    });

    await booking.save();

    // Update chef availability
    chef.isAvailable = false;
    await chef.save();

    // Send Email Confirmation
    await sendBookingConfirmation(email, booking, chef);

    res.status(200).json({ message: "Booking confirmed! Chef allocated.", booking });

  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
