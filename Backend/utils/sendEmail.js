const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send booking confirmation email
 * @param {string} userEmail - Customer's email
 * @param {object} booking - Booking details
 * @param {object} chef - Allocated chef details
 */
async function sendBookingConfirmation(userEmail, booking, chef) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Booking Confirmation - DoorChef",
    html: `
      <h2>🎉 Booking Confirmed! 🎉</h2>
      <p>Dear Customer,</p>
      <p>Your booking is confirmed. Here are the details:</p>
      <ul>
        <li><strong>Dish:</strong> ${booking.dishName}</li>
        <li><strong>Date:</strong> ${booking.bookingTime}</li>
        <li><strong>Location:</strong> ${booking.location}</li>
        <li><strong>Chef:</strong> ${chef.name}</li>
        <li><strong>Chef Contact:</strong> ${chef.phone}</li>
      </ul>
      <p>Thank you for choosing DoorChef! 🍽️</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation email sent to:", userEmail);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

module.exports = { sendBookingConfirmation };
