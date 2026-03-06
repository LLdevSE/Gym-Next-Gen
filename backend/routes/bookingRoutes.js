const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getCoachBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, coach } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/coachbookings').get(protect, coach, getCoachBookings);
router.route('/:id/status').put(protect, coach, updateBookingStatus);

module.exports = router;
