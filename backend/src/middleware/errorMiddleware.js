const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors && { errors: err.errors }) // Include validation errors if available
    });
  }

  // Handle Joi validation errors specifically
  if (err.isJoi) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation error',
      errors: err.details.map(detail => detail.message)
    });
  }

  // Handle Mongoose validation/cast errors (e.g., invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: `Invalid ID: ${err.value}`,
    });
  }
  if (err.name === 'ValidationError') { // Mongoose validation errors (e.g., required field missing)
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: message,
      errors: errors
    });
  }
  if (err.code === 11000) { // Mongoose duplicate key error (e.g., unique email)
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: message,
    });
  }


  // Generic internal server error
  console.error(err); // Log the full error for debugging purposes
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Something went wrong on the server',
  });
};

module.exports = errorHandler;