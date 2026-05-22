import express from 'express';
import { createBooking, getUserBookings, updateBookingStatus } from '../controllers/bookingController.js';

const router = express.Router();

router.route('/').post(createBooking).get(getUserBookings);
router.route('/:id/status').patch(updateBookingStatus);

export default router;
