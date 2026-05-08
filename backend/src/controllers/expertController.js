const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

const DEFAULT_TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const buildDateRange = (days) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i += 1) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);
    dates.push(current.toISOString().split('T')[0]);
  }
  return dates;
};

const getExperts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const search = req.query.search ? req.query.search.trim() : '';
  const category = req.query.category ? req.query.category.trim() : '';

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }

  const total = await Expert.countDocuments(filter);
  const experts = await Expert.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  res.json({
    data: experts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

const getExpertById = async (req, res) => {
  const expert = await Expert.findById(req.params.id).lean();

  if (!expert) {
    res.status(404);
    throw new Error('Expert not found');
  }

  const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 14);
  const dates = buildDateRange(days);
  const bookings = await Booking.find({ expert: expert._id, date: { $in: dates } }).lean();

  const availableSlots = dates.map((date) => {
    const bookedSlots = bookings.filter((booking) => booking.date === date).map((booking) => booking.timeSlot);
    return {
      date,
      slots: DEFAULT_TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot)),
      bookedSlots,
    };
  });

  res.json({ ...expert, availableSlots });
};

module.exports = {
  getExperts,
  getExpertById,
};
