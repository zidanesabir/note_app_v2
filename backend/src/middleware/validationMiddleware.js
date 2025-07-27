const Joi = require('joi');

// Middleware to validate request body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(error); 
  }
  next();
};

// Joi validation schemas
const authSchemas = {
  registerSchema: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    })
  }),
  loginSchema: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    })
  })
};

const noteSchemas = {
  createNoteSchema: Joi.object({
    title: Joi.string().min(3).max(255).required(),
    content: Joi.string().min(1).required(),
    tags: Joi.string().allow('', null).optional(),
    visibility_status: Joi.string().valid('private', 'shared', 'public').default('private')
  }),
  updateNoteSchema: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    content: Joi.string().min(1).optional(),
    tags: Joi.string().allow('', null).optional(),
    visibility_status: Joi.string().valid('private', 'shared', 'public').optional()
  }),
  shareNoteSchema: Joi.object({
    userId: Joi.string().required() // MongoDB IDs are strings
  })
};

module.exports = { validate, authSchemas, noteSchemas };