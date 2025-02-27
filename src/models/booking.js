const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
    dishName: { type: String, required: true },
    location: { type: String, required: true },
    bookingTime: { type: Date, required: true },
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], required: true },
    chefName: { type: String },
    chefPhone: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);