// scripts/assignOfficerDepartment.js
require('dotenv').config();
const mongoose = require('mongoose');
const Officer = require('../models/Officer');
const Department = require('../models/Department');

async function assignDepartment() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the officer
    const officer = await Officer.findOne({ email: 'shubhamcharate01@gmail.com' });
    
    if (!officer) {
      console.log('❌ Officer not found');
      process.exit(1);
    }

    console.log('👮 Found officer:', officer.name);
    console.log('   Current department:', officer.department || 'None');

    // Find Roads & Infrastructure Department
    const department = await Department.findOne({ 
      name: /Roads.*Infrastructure/i 
    });

    if (!department) {
      console.log('❌ Roads & Infrastructure Department not found');
      process.exit(1);
    }

    console.log('🏢 Found department:', department.name);

    // Assign department to officer
    officer.department = department._id;
    await officer.save();

    console.log('✅ Officer assigned to department successfully!');
    console.log(`   ${officer.name} → ${department.name}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

assignDepartment();
