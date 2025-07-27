const mongoose = require('mongoose');

const SharedNoteSchema = new mongoose.Schema({
  note: { // Reference to the Note that is being shared
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note', // Refers to the 'Note' model
    required: true,
  },
  sharedWith: { // Reference to the User who the note is shared with
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Mongoose manages createdAt and updatedAt
  // Define a unique compound index to ensure a note is shared only once with a specific user
  indexes: [{ unique: true, fields: ['note', 'sharedWith'] }]
});

module.exports = mongoose.model('SharedNote', SharedNoteSchema);