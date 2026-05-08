const express = require('express');
const {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} = require('../controllers/bookingController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(createBooking));
router.get('/', asyncHandler(getBookingsByEmail));
router.patch('/:id/status', asyncHandler(updateBookingStatus));

module.exports = router;
