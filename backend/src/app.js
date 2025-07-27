require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDB = require('./utils/db'); // Import DB connection utility

const app = express();

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Middleware
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS for all origins (adjust for production)

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// General route for health check
app.get('/', (req, res) => {
  res.send('Welcome to the Collaborative Notes API (Node.js + MongoDB)!');
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

module.exports = app;