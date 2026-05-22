import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Expert',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking: Compound unique index
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
