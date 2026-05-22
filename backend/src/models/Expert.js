import mongoose from 'mongoose';

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    availableSlots: [
      {
        date: {
          type: String,
          required: true,
        },
        slots: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
