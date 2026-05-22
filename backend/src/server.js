import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import expertRoutes from './routes/expertRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { initSocket } from './sockets/socketManager.js';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next(); // Pass to API 404 handler
    }
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
