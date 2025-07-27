const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, authSchemas } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', validate(authSchemas.registerSchema), authController.register);
router.post('/login', validate(authSchemas.loginSchema), authController.login);

// Protected route
router.get('/me', authMiddleware, authController.getMe);

// Public endpoint to find users by email (for sharing feature)
router.get('/users', authController.findUserByEmail);

module.exports = router;