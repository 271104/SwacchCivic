// scripts/checkOfficers.js
require('dotenv').config();
const mongoose = require('mongoose');
const Officer = require('../models/Officer');
const Department = require('../models/Department');

async function checkOfficers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    // Get all officers
    const officers = await Officer.find()
      .populate('department', 'name')
      .select('-password');

    console.log('\n📊 Total Officers:', officers.length);
    
    if (officers.length === 0) {
      console.log('❌ No officers found in database');
    } else {
      console.log('\n👮 Officers List:');
      officers.forEach((officer, index) => {
        console.log(`\n${index + 1}. ${officer.name}`);
        console.log(`   Email: ${officer.email}`);
        console.log(`   Phone: ${officer.phone}`);
        console.log(`   Status: ${officer.status}`);
        console.log(`   Department: ${officer.department?.name || 'Not assigned'}`);
        console.log(`   Created: ${officer.createdAt}`);
      });
    }

    // Get departments with officer counts
    const departments = await Department.find();
    console.log('\n\n🏢 Departments:');
    
    for (const dept of departments) {
      const activeCount = await Officer.countDocuments({
        department: dept._id,
        status: 'active'
      });
      
      const pendingCount = await Officer.countDocuments({
        department: dept._id,
        status: 'pending'
      });
      
      const totalCount = await Officer.countDocuments({
        department: dept._id
      });
      
      console.log(`\n${dept.name}:`);
      console.log(`   Active Officers: ${activeCount}`);
      console.log(`   Pending Officers: ${pendingCount}`);
      console.log(`   Total Officers: ${totalCount}`);
    }

    mongoose.connection.close();
    console.log('\n✅ Check complete');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkOfficers();
