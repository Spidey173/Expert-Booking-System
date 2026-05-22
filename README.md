# Expert Booking System

A full-stack web application that allows users to book sessions with various experts in real-time.

## Features

- **Expert Listing**: View all experts, search by name, filter by category, and pagination.
- **Expert Profile**: View expert details, ratings, and available time slots.
- **Real-time Booking**: Book an available slot. Already booked slots are disabled instantly for all users via Socket.io.
- **Double Booking Prevention**: MongoDB compound unique index and atomic operations ensure no double booking.
- **My Bookings**: Search for user bookings using an email address.
- **Responsive UI**: Built with Tailwind CSS.

## Tech Stack

- **Frontend**: React.js, React Router, Vite, Tailwind CSS, Axios, Socket.io-client
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js installed (v16+ recommended)
- MongoDB running locally or MongoDB Atlas URI

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (or rename `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expert-booking
CLIENT_URL=http://localhost:5173
```

Seed the database with sample experts and available slots:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (or rename `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Experts
- `GET /api/experts` - Get paginated list of experts (supports `?page=1&limit=6&search=&category=`)
- `GET /api/experts/:id` - Get single expert details

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings?email=user@example.com` - Get all bookings for an email

## Project Architecture
- Clean Code MVC Architecture in Backend.
- Modular component-based architecture in React.
- Error handling middleware in Express.
