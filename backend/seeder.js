const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany(); // Clear existing users

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123', salt);

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@gymnextgen.com', // Fake email for Admin
      password: hashedPassword,
      role: 'Admin',
    });

    await adminUser.save();

    console.log('Admin Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
