module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  databaseUri: process.env.DATABASE_URI, // Changed to databaseUri
  port: process.env.PORT || 8000,
};