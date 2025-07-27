const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const ApiError = require('../errors/ApiError');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);

      // Validate decoded.id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return next(ApiError.unauthorized('Not authorized, invalid token ID'));
      }

      // Find user by MongoDB _id
      req.user = await User.findById(decoded.id).select('-password'); // Exclude password from req.user
      if (!req.user) {
        return next(ApiError.unauthorized('Not authorized, user not found'));
      }
      // Attach the user's MongoDB _id string to req.user.id for consistency in controllers
      req.user.id = req.user._id.toString(); 
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return next(ApiError.unauthorized('Not authorized, token failed'));
    }
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized, no token'));
  }
};

module.exports = protect;