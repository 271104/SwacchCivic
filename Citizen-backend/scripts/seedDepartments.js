// scripts/seedDepartments.js
const mongoose = require('mongoose');
const Department = require('../models/Department');
require('dotenv').config();

const departments = [
  {
    name: "Sanitation Department",
    description: "Handles garbage collection, waste management, and cleanliness operations",
    complaintTypes: ["Garbage"],
    isActive: true
  },
  {
    name: "Roads & Infrastructure Department",
    description: "Manages road maintenance, repairs, and infrastructure development",
    complaintTypes: ["Road Damage"],
    isActive: true
  },
  {
    name: "Water Supply Department",
    description: "Handles water supply, distribution, and leakage issues",
    complaintTypes: ["Water Leakage"],
    isActive: true
  },
  {
    name: "Electrical Department",
    description: "Manages street lights, electrical infrastructure, and power supply",
    complaintTypes: ["Street Light"],
    isActive: true
  },
  {
    name: "Drainage & Sewerage Department",
    description: "Handles drainage systems, sewerage, and flood prevention",
    complaintTypes: ["Drainage"],
    isActive: true
  }
];

async function seedDepartments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smc_citizen');
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    // Clear existing departments
    await Department.deleteMany({});
    console.log('🗑️  Cleared existing departments');

    // Insert departments
    const result = await Department.insertMany(departments);
    console.log(`✅ Created ${result.length} departments:`);
    
    result.forEach(dept => {
      console.log(`   - ${dept.name} (${dept.complaintTypes.join(', ')})`);
    });

    console.log('\n✅ Department seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    process.exit(1);
  }
}

seedDepartments();
