const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Customer
const createBooking = async (req, res) => {
  const { coachId, sessionPeriod, date } = req.body;

  if (req.user.role !== 'Customer') {
     return res.status(401).json({ message: 'Only customers can create bookings' });
  }

  const booking = new Booking({
    customerId: req.user._id,
    coachId,
    sessionPeriod,
    date,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

// @desc    Get logged in user's bookings (Customer)
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ customerId: req.user._id }).populate(
    'coachId',
    'name email'
  );
  res.json(bookings);
};

// @desc    Get coach's bookings (Coach)
// @route   GET /api/bookings/coachbookings
// @access  Private/Coach
const getCoachBookings = async (req, res) => {
  const bookings = await Booking.find({ coachId: req.user._id }).populate(
    'customerId',
    'name email'
  );
  res.json(bookings);
};

// @desc    Update booking status (Confirm/Decline)
// @route   PUT /api/bookings/:id/status
// @access  Private/Coach
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    if (booking.coachId.toString() !== req.user._id.toString()) {
       return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getCoachBookings,
  updateBookingStatus,
};
