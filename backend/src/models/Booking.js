const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  clientName: { type: String, required: true, trim: true },
  clientEmail: { type: String, required: true, trim: true, lowercase: true },
  clientPhone: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, trim: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ expert: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
