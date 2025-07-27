const Note = require('../models/noteModel');
const User = require('../models/userModel');
const SharedNote = require('../models/sharedNoteModel');
const ApiError = require('../errors/ApiError');
const mongoose = require('mongoose'); // Needed for ObjectId

exports.createNote = async (req, res, next) => {
  const { title, content, tags, visibility_status } = req.body;

  try {
    const note = await Note.create({
      title,
      content,
      tags,
      visibility_status,
      owner: req.user.id // owner is MongoDB ObjectId
    });

    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

exports.getNotes = async (req, res, next) => {
  const { status, q, skip = 0, limit = 10 } = req.query;
  const ownerId = req.user.id; // Authenticated user's MongoDB _id string

  let query = {};
  let sharedNoteIds = [];

  // 1. Determine notes owned by the user
  let ownedConditions = { owner: ownerId };

  // 2. Determine notes shared with the user
  if (status === 'shared' || !status || status === 'all') {
    const sharedNotes = await SharedNote.find({ sharedWith: ownerId }).select('note');
    sharedNoteIds = sharedNotes.map(sn => sn.note); // Get array of Note ObjectIds
  }

  // Combine owned and shared conditions
  let combinedConditions = [{ owner: ownerId }];
  if (sharedNoteIds.length > 0) {
    combinedConditions.push({ _id: { $in: sharedNoteIds } });
  }
  query.$or = combinedConditions; // Initial query combines owned or shared notes

  // 3. Apply status filter
  if (status && status !== 'all') {
    if (status === 'shared') {
      // For 'shared' status, must be in sharedNoteIds AND visibility_status must be 'shared'
      query = {
        _id: { $in: sharedNoteIds },
        visibility_status: 'shared'
      };
    } else if (status === 'private' || status === 'public') {
      // For 'private' or 'public', must be owned by current user AND match status
      query = {
        owner: ownerId, // Only notes owned by the current user
        visibility_status: status
      };
    }
  }

  // 4. Apply search query
  if (q) {
    const searchCondition = {
      $or: [
        { title: { $regex: q, $options: 'i' } }, // Case-insensitive search
        { tags: { $regex: q, $options: 'i' } }
      ]
    };
    // Combine search with existing query conditions using $and if query already has conditions
    if (Object.keys(query).length > 0) {
        query = { $and: [query, searchCondition] };
    } else {
        query = searchCondition;
    }
  }

  try {
    const totalCount = await Note.countDocuments(query); // Total count for pagination

    const notes = await Note.find(query)
      .populate('owner', 'email') // Populate owner details (just email)
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const formattedNotes = notes.map(note => ({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      tags: note.tags,
      visibility_status: note.visibility_status,
      owner_id: note.owner ? note.owner._id : null, // Mongoose ID
      owner_email: note.owner ? note.owner.email : null, // Populated email
    }));

    res.status(200).json({
      total: totalCount,
      notes: formattedNotes
    });

  } catch (error) {
    console.error("Error fetching notes:", error);
    next(ApiError.internal(error.message));
  }
};


exports.getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; // Authenticated user's MongoDB _id string

  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ApiError.badRequest('Invalid note ID format'));
    }

    const note = await Note.findById(id).populate('owner', 'email'); // Populate owner email
    if (!note) {
      return next(ApiError.notFound('Note not found'));
    }

    const isOwner = note.owner._id.equals(userId); // Use Mongoose .equals() for ObjectId comparison
    const isShared = await SharedNote.findOne({ note: id, sharedWith: userId });

    if (!isOwner && !isShared && note.visibility_status !== 'public') {
      return next(ApiError.forbidden('Not authorized to access this note'));
    }

    const formattedNote = {
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      tags: note.tags,
      visibility_status: note.visibility_status,
      owner_id: note.owner ? note.owner._id : null,
      owner_email: note.owner ? note.owner.email : null,
    };

    res.status(200).json(formattedNote);
  } catch (error) {
    console.error("Error getting note by ID:", error);
    next(ApiError.internal(error.message));
  }
};

exports.updateNote = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, tags, visibility_status } = req.body;
  const ownerId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ApiError.badRequest('Invalid note ID format'));
    }

    const note = await Note.findById(id);
    if (!note) {
      return next(ApiError.notFound('Note not found'));
    }
    if (!note.owner.equals(ownerId)) { // Mongoose .equals()
      return next(ApiError.forbidden('Not authorized to update this note'));
    }

    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;
    note.tags = tags !== undefined ? tags : note.tags; // Allows setting to empty string or null
    note.visibility_status = visibility_status !== undefined ? visibility_status : note.visibility_status;
    note.updatedAt = new Date();

    await note.save();

    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (error) {
    console.error("Error updating note:", error);
    next(ApiError.internal(error.message));
  }
};

exports.deleteNote = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(ApiError.badRequest('Invalid note ID format'));
    }

    const note = await Note.findById(id);
    if (!note) {
      return next(ApiError.notFound('Note not found'));
    }
    if (!note.owner.equals(ownerId)) { // Mongoose .equals()
      return next(ApiError.forbidden('Not authorized to delete this note'));
    }

    await SharedNote.deleteMany({ note: id }); // Delete associated shared notes

    await note.deleteOne(); // Mongoose delete method

    res.status(204).json({ message: 'Note deleted successfully' }); // 204 No Content
  } catch (error) {
    console.error("Error deleting note:", error);
    next(ApiError.internal(error.message));
  }
};

exports.shareNote = async (req, res, next) => {
  const { id: noteId } = req.params;
  const { userId: sharedWithId } = req.body; // User ID to share with
  const ownerId = req.user.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId) || !mongoose.Types.ObjectId.isValid(sharedWithId)) {
        return next(ApiError.badRequest('Invalid ID format for note or user'));
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return next(ApiError.notFound('Note not found'));
    }
    if (!note.owner.equals(ownerId)) { // Mongoose .equals()
      return next(ApiError.forbidden('Only the owner can share a note'));
    }

    const targetUser = await User.findById(sharedWithId);
    if (!targetUser) {
      return next(ApiError.notFound('Target user not found'));
    }
    if (targetUser._id.equals(ownerId)) { // Compare ObjectIds
      return next(ApiError.badRequest('Cannot share a note with yourself'));
    }

    const existingShare = await SharedNote.findOne({ note: noteId, sharedWith: sharedWithId });
    if (existingShare) {
      return next(ApiError.badRequest('Note already shared with this user'));
    }

    await SharedNote.create({ note: noteId, sharedWith: sharedWithId });

    res.status(200).json({ message: `Note shared with user ${targetUser.email}` });
  } catch (error) {
    console.error("Error sharing note:", error);
    next(ApiError.internal(error.message));
  }
};