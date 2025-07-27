const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, noteSchemas } = require('../middleware/validationMiddleware');

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

router.post('/', validate(noteSchemas.createNoteSchema), noteController.createNote);
router.get('/', noteController.getNotes); // Includes pagination, search, filter
router.get('/:id', noteController.getNoteById);
router.put('/:id', validate(noteSchemas.updateNoteSchema), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

// Note Sharing specific route
router.post('/:id/share', validate(noteSchemas.shareNoteSchema), noteController.shareNote);

module.exports = router;