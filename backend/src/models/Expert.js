const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  experience: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  bio: { type: String, trim: true },
  hourlyRate: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expert', expertSchema);
