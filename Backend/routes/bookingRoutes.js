const express = require('express');
const router = express.Router();
const Booking = require('../models/booking'); // Order schema
const Chef = require('../models/chef'); // Chef schema
const nodemailer = require('nodemailer');

// API to handle booking & chef allocation
router.post('/allocate-chef', async (req, res) => {
    try {
        const { userId, dishId, dishName, location, bookingTime, paymentStatus } = req.body;

        // Ensure payment is successful
        if (paymentStatus !== 'success') {
            return res.status(400).json({ message: 'Payment not completed!' });
        }

        // Find available chef based on specialty, availability, and location
        const chef = await Chef.findOne({
            specialty: dishName, // Match chef's specialty with dish
            isAvailable: true,
            location: location // Ensure the chef is near
        });

        if (!chef) {
            return res.status(404).json({ message: 'No available chefs at the moment' });
        }

        // Create new booking with allocated chef
        const booking = new Booking({
            userId,
            dishId,
            dishName,
            location,
            bookingTime,
            paymentStatus,
            chefId: chef._id, 
            chefName: chef.name,
            chefPhone: chef.phone
        });

        await booking.save();

        // Mark the chef as unavailable
        chef.isAvailable = false;
        await chef.save();

        // Send confirmation emails
        await sendConfirmationEmail(req.body.email, chef, booking);

        res.status(200).json({ message: 'Chef allocated successfully!', booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
