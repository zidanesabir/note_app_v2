const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../errors/ApiError');

exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(ApiError.badRequest('Email already registered'));
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email } // MongoDB _id
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
  const user = await User.findOne({ email }).select('+password'); 
    if (!user) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn }); // MongoDB _id

    res.status(200).json({
      message: 'Logged in successfully',
      access_token: token,
      token_type: 'bearer'
    });
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

exports.getMe = async (req, res, next) => {
  // req.user is set by authMiddleware
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return next(ApiError.notFound('User not found'));
    }
    res.status(200).json({ id: user._id, email: user.email }); // Format for response
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};

// New: Endpoint to find users by email
exports.findUserByEmail = async (req, res, next) => {
  const { email } = req.query;

  try {
    if (!email) {
      return next(ApiError.badRequest('Email query parameter is required'));
    }
    const users = await User.find({ email }).select('id email'); // Find users by email, select id and email
    
    // Mongoose returns empty array if no user found, which is fine for frontend
    res.status(200).json(users.map(user => ({ id: user._id, email: user.email })));
  } catch (error) {
    next(ApiError.internal(error.message));
  }
};