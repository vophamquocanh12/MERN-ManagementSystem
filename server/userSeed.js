import connectDB from './db/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connectDB from './db/db.js';

dotenv.config(); // Load environment variables

const userRegister = async () => {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    if (existingUser) {
      console.log("Admin user already exists. Skipping seeding.");
      return process.exit(0);
    }

    // Hash password and create new user
    const hashPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin",
      profileImage: '', // Optional
    });

    await newUser.save();
    console.log("Admin user saved to MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

userRegister();
