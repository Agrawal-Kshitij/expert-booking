require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('../models/Expert');
const connectDB = require('../config/db');

const experts = [
  {
    name: 'Asha Singh',
    category: 'Career Coaching',
    experience: 8,
    rating: 4.9,
    bio: 'Help professionals achieve career breakthroughs.',
    hourlyRate: 120,
  },
  {
    name: 'Rahul Patel',
    category: 'Startup Mentoring',
    experience: 12,
    rating: 4.8,
    bio: 'Founder and early-stage startup mentor.',
    hourlyRate: 150,
  },
  {
    name: 'Meera Joshi',
    category: 'Leadership Training',
    experience: 10,
    rating: 4.7,
    bio: 'Leadership development for managers and founders.',
    hourlyRate: 130,
  },
  {
    name: 'Nikhil Sharma',
    category: 'Technical Interview Prep',
    experience: 7,
    rating: 4.6,
    bio: 'Technical interview coaching and mock problem solving.',
    hourlyRate: 100,
  },
];

const seed = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Expert.deleteMany({});
    await Expert.insertMany(experts);
    console.log('Seeded expert data successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
