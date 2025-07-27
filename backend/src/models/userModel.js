const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Store emails in lowercase for consistency
    match: [/.+@.+\..+/, 'Please use a valid email address'],
  },
  password: { // Storing hashed password
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't return password by default on queries
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Mongoose adds createdAt and updatedAt
  // You can define other schema options here
});

module.exports = mongoose.model('User', UserSchema);