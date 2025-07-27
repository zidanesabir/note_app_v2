const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    const uri = config.databaseUri;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables or config.");
    }

    await mongoose.connect(uri);

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB; // Export the connection function