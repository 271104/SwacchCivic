// scripts/reassignComplaints.js
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
require('dotenv').config();

// Mapping from old AI types to new department types
const typeMapping = {
  'Garbage Collection': 'Garbage',
  'Garbage': 'Garbage',
  'Road Damage': 'Road Damage',
  'Water Leakage': 'Water Leakage',
  'Street Light': 'Street Light',
  'Drainage': 'Drainage'
};

async function reassignComplaints() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    // Get all departments
    const departments = await Department.find({ isActive: true });
    console.log(`\n🏢 Found ${departments.length} active departments`);

    // Create a mapping of complaint types to department IDs
    const typeToDepartment = {};
    departments.forEach(dept => {
      dept.complaintTypes.forEach(type => {
        typeToDepartment[type] = dept;
      });
    });

    console.log('\n📋 Department Mapping:');
    Object.entries(typeToDepartment).forEach(([type, dept]) => {
      console.log(`   "${type}" → ${dept.name}`);
    });

    // Get all complaints
    const complaints = await Complaint.find({});
    console.log(`\n📝 Found ${complaints.length} complaints to process`);

    let updatedCount = 0;
    let typeChangedCount = 0;
    let alreadyAssignedCount = 0;

    for (const complaint of complaints) {
      const oldType = complaint.type;
      const newType = typeMapping[oldType] || oldType;
      
      // Update type if it changed
      if (oldType !== newType) {
        complaint.type = newType;
        typeChangedCount++;
        console.log(`   📝 Updated type: "${oldType}" → "${newType}"`);
      }

      // Find matching department
      const department = typeToDepartment[newType];
      
      if (department) {
        if (!complaint.assignedDepartment || complaint.assignedDepartment.toString() !== department._id.toString()) {
          complaint.assignedDepartment = department._id;
          complaint.assignedAt = new Date();
          await complaint.save();
          updatedCount++;
          console.log(`   ✅ Assigned complaint ${complaint._id} to ${department.name}`);
        } else {
          alreadyAssignedCount++;
          console.log(`   ℹ️  Complaint ${complaint._id} already assigned to ${department.name}`);
        }
      } else {
        console.log(`   ⚠️  No department found for type: "${newType}"`);
      }
    }

    console.log('\n📊 SUMMARY:');
    console.log(`   Total complaints: ${complaints.length}`);
    console.log(`   Types updated: ${typeChangedCount}`);
    console.log(`   Departments assigned: ${updatedCount}`);
    console.log(`   Already assigned: ${alreadyAssignedCount}`);
    console.log(`   Not assigned: ${complaints.length - updatedCount - alreadyAssignedCount}`);

    console.log('\n✅ Reassignment completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

reassignComplaints();
