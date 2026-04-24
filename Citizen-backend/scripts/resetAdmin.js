// scripts/resetAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

async function resetAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smc_citizen');
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    // Delete all existing admins
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing admin(s)`);

    // Create new admin account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      name: 'SMC Administrator',
      email: 'admin@solapurcorporation.gov.in',
      phone: '0217-2735293',
      password: hashedPassword,
      status: 'active'
    });

    await admin.save();

    console.log('\n✅ New admin account created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log(`   Email: admin@solapurcorporation.gov.in`);
    console.log(`   Password: admin123`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    process.exit(1);
  }
}

resetAdmin();
