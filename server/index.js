require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const priceService = require('./services/priceService');
const portfolioRoutes = require('./routes/portfolio');
const alertRoutes = require('./routes/alerts');
const exchangeRoutes = require('./routes/exchanges');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for dev
  },
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptotracker';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/exchanges', exchangeRoutes);


// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io
io.on('connection', async (socket) => {
  console.log('✓ Client connected:', socket.id);

  // Send initial price data immediately to new clients
  try {
    const currentPrices = await priceService.fetchPrices();
    if (currentPrices) {
      socket.emit('price_update', currentPrices);
      console.log('  → Sent initial price data to', socket.id);
    }
  } catch (error) {
    console.error('Error sending initial prices:', error.message);
  }

  socket.on('disconnect', () => {
    console.log('✗ Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error for', socket.id, ':', error.message);
  });
});

// Start Price Service (Emits to io)
priceService.start(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
