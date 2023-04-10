/** @format */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database is connected');
  } catch (error) {
    console.log(error.message);
    console.log(`Database Not Connected`);
    process.exit(1);
  }
};


module.exports = connectDB;
