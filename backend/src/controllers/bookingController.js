import Booking from '../models/Booking.js';
import Expert from '../models/Expert.js';
import { getIo } from '../sockets/socketManager.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      res.status(404);
      throw new Error('Expert not found');
    }

    // Check if slot exists in expert's available slots
    const dateObj = expert.availableSlots.find(d => d.date === date);
    if (!dateObj || !dateObj.slots.includes(timeSlot)) {
      res.status(400);
      throw new Error('Selected time slot is not available');
    }

    // Create booking. Will throw 11000 duplicate key error if double booked due to compound index
    const booking = await Booking.create({
      expertId,
      name,
      email,
      phone,
      date,
      timeSlot,
      notes,
    });

    // Remove the booked slot from expert's availability
    await Expert.updateOne(
      { _id: expertId, 'availableSlots.date': date },
      { $pull: { 'availableSlots.$.slots': timeSlot } }
    );

    // Emit socket event for real-time update
    const io = getIo();
    io.emit('slotBooked', { expertId, date, timeSlot });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    // Handle MongoDB unique constraint error
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('Time slot already booked'));
    }
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Public
export const getUserBookings = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400);
      throw new Error('Email is required to fetch bookings');
    }

    const bookings = await Booking.find({ email })
      .populate('expertId', 'name category image')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Public
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    next(error);
  }
};
