import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expert from '../models/Expert.js';
import Booking from '../models/Booking.js';
import connectDB from '../config/db.js';

dotenv.config();

const getNextDays = (numDays) => {
  const days = [];

  for (let i = 1; i <= numDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    days.push(date.toISOString().split('T')[0]);
  }

  return days;
};

const defaultSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

const days = getNextDays(5);

const generateAvailableSlots = () => {
  return days.map((date) => ({
    date,
    slots: [...defaultSlots],
  }));
};

const expertsData = [
  {
    name: 'Dr. Sarah Connor',
    category: 'Therapist',
    experience: 10,
    rating: 4.8,
    bio: 'Experienced therapist specializing in cognitive behavioral therapy and stress management.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'John Doe',
    category: 'Life Coach',
    experience: 5,
    rating: 4.5,
    bio: 'Helping individuals achieve their personal and professional goals through actionable plans.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'Alice Smith',
    category: 'Nutritionist',
    experience: 8,
    rating: 4.9,
    bio: 'Certified nutritionist helping you build healthy eating habits and sustainable diets.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'Michael Brown',
    category: 'Fitness Trainer',
    experience: 12,
    rating: 4.7,
    bio: 'Personal trainer focusing on strength building and cardiovascular health.',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'Dr. Emily Davis',
    category: 'Therapist',
    experience: 15,
    rating: 5.0,
    bio: 'Expert in family counseling and relationship advice.',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'James Wilson',
    category: 'Life Coach',
    experience: 6,
    rating: 4.6,
    bio: 'Career transition and executive coaching.',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'Sophia Martinez',
    category: 'Yoga Instructor',
    experience: 9,
    rating: 4.9,
    bio: 'Yoga teacher specializing in Vinyasa and Yin yoga.',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'David Lee',
    category: 'Financial Advisor',
    experience: 14,
    rating: 4.8,
    bio: 'Financial planner helping you secure your future and manage investments.',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'Laura Garcia',
    category: 'Nutritionist',
    experience: 7,
    rating: 4.7,
    bio: 'Sports nutritionist working with athletes and active individuals.',
    image: 'https://randomuser.me/api/portraits/women/77.jpg',
    availableSlots: generateAvailableSlots(),
  },
  {
    name: 'Robert Taylor',
    category: 'Fitness Trainer',
    experience: 10,
    rating: 4.8,
    bio: 'Functional training and mobility expert.',
    image: 'https://randomuser.me/api/portraits/men/88.jpg',
    availableSlots: generateAvailableSlots(),
  },
];

const importData = async () => {
  try {
    // WAIT for DB connection first
    await connectDB();

    console.log('MongoDB Connected');

    // Clear old data
    await Expert.deleteMany();
    await Booking.deleteMany();

    // Insert new data
    await Expert.insertMany(expertsData);

    console.log('Data Imported!');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);

    process.exit(1);
  }
};

importData();