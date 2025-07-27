const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [255, 'Title cannot be more than 255 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  tags: {
    type: String, // Stored as comma-separated string
    trim: true,
  },
  visibility_status: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private',
    required: true,
  },
  owner: { // Reference to the User who owns this note (MongoDB ObjectId)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true,
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
  timestamps: true, // Mongoose manages createdAt and updatedAt
});

module.exports = mongoose.model('Note', NoteSchema);