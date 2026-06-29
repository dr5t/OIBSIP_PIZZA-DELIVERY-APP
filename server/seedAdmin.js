require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@pizzacraft.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`⚠️ Admin account (${adminEmail}) already exists.`);
      process.exit(0);
    }

    const admin = new User({
      name: 'PizzaCraft Admin',
      email: adminEmail,
      password: 'adminpassword123',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log(`✅ Admin account created successfully!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: adminpassword123`);
    console.log(`Make sure to change the password after logging in.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

seedAdmin();
