/**
 * Database Configuration (Mongoose / MongoDB)
 * Path: backend/config/db.js
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospito_health';
    const conn = await mongoose.connect(connUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Non-blocking exit or retry depending on environment
    process.exit(1);
  }
};

module.exports = connectDB;
