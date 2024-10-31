
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const http = require('http');  
const { Server } = require('socket.io'); 

const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driver');
const adminRoutes = require('./routes/admin');
const rideRequestRouter = require('./routes/RideRequestSchema'); 
const contactRoute = require('./routes/contact'); 
const paymentRoutes = require('./routes/Payment');

dotenv.config();

const app = express();

// Create the server using http, passing the express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000 
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ride-request', rideRequestRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', authRoutes);
app.use('/api/contact', contactRoute);  


// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user or driver connected:', socket.id);

  // Listen for 'join' event to allow users (drivers) to join specific rooms
  socket.on('join', (role, userId) => {
    if (role === 'driver') {
      socket.join(`driver_${userId}`);  // Driver joins a room with their userId
      console.log(`Driver ${userId} has joined the room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user or driver disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export io instance for use in controllers
module.exports = { io };
