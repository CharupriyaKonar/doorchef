const express = require('express');
const router = express.Router();
const Booking = require('../models/booking'); // Order schema
const Chef = require('../models/chef'); // Chef schema
const nodemailer = require('nodemailer');


router.get("/booking", async (req, res) => {
    let bookings = await Booking.find({chefName:req.session.user.name}).populate('userId');
    res.json(bookings);
})

router.post("/booking", async (req, res) => {
    try {
        const { userId, dishName, location, bookingTime, paymentStatus, chefName, chefPhone } = req.body;
  
        // Ensure user is authenticated
        if (!req.session.user || !req.session.user.id) {
            return res.status(401).json({ error: "Unauthorized. Please log in." });
        }
  
        // Validate required fields
        if (!dishName || !location || !bookingTime || !paymentStatus) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }
  
        // Create new booking
        const booking = new Booking({
            userId,
            dishName,
            location,
            bookingTime,
            paymentStatus,
            chefName,
            chefPhone,
        });
  
        // Save to database
        await booking.save();
        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
// Function to send email confirmation
async function sendConfirmationEmail(userEmail, chef, booking) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password' // Use App Password, NOT real password
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: 'Booking Confirmation - DoorChef',
        text: `Your booking is confirmed!\n\nDish: ${booking.dishName}\nChef: ${chef.name}\nContact: ${chef.phone}\nLocation: ${booking.location}\n\nThank you for choosing DoorChef!`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = router;
