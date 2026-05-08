const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { emitSlotUpdate } = require('../socket');

const validateBookingInput = ({ expertId, clientName, clientEmail, clientPhone, date, timeSlot }) => {
  const errors = {};

  if (!expertId) errors.expertId = 'Expert ID is required';
  if (!clientName || clientName.trim().length < 2) errors.clientName = 'Name must be at least 2 characters';
  if (!clientEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clientEmail)) errors.clientEmail = 'A valid email is required';
  if (!clientPhone || clientPhone.trim().length < 7) errors.clientPhone = 'Phone number is required';
  if (!date) errors.date = 'Date is required';
  if (!timeSlot) errors.timeSlot = 'Time slot is required';

  return errors;
};

const createBooking = async (req, res) => {
  const {
    expertId,
    clientName,
    clientEmail,
    clientPhone,
    date,
    timeSlot,
    notes,
  } = req.body;

  const errors = validateBookingInput({ expertId, clientName, clientEmail, clientPhone, date, timeSlot });
  if (Object.keys(errors).length) {
    res.status(400);
    const validationError = new Error('Validation failed');
    validationError.errors = errors;
    throw validationError;
  }

  const expert = await Expert.findById(expertId);
  if (!expert) {
    res.status(404);
    throw new Error('Expert not found');
  }

  try {
    const booking = await Booking.create({
      expert: expertId,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone.trim(),
      date: date.trim(),
      timeSlot: timeSlot.trim(),
      notes: notes ? notes.trim() : '',
    });

    emitSlotUpdate(expertId, {
      expertId,
      date: booking.date,
      timeSlot: booking.timeSlot,
      bookingId: booking._id,
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      throw new Error('Selected time slot is already booked');
    }
    throw error;
  }
};

const getBookingsByEmail = async (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.status(400);
    throw new Error('Email query parameter is required');
  }

  const bookings = await Booking.find({ clientEmail: email.trim().toLowerCase() })
    .populate('expert', 'name category experience rating')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ data: bookings });
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
    res.status(400);
    throw new Error('Status must be Pending, Confirmed, or Completed');
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = status;
  await booking.save();

  res.json({ message: 'Booking status updated', booking });
};

module.exports = {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
};
