// scripts/checkComplaintTypes.js
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
require('dotenv').config();

async function checkComplaintTypes() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    // Get all complaints
    const complaints = await Complaint.find({})
      .select('type assignedDepartment')
      .populate('assignedDepartment', 'name');

    console.log('\n📋 COMPLAINTS IN DATABASE:');
    console.log('Total complaints:', complaints.length);
    
    const typeCount = {};
    complaints.forEach(c => {
      typeCount[c.type] = (typeCount[c.type] || 0) + 1;
      console.log(`   - Type: "${c.type}" | Department: ${c.assignedDepartment ? c.assignedDepartment.name : 'UNASSIGNED'}`);
    });

    console.log('\n📊 TYPE SUMMARY:');
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`   "${type}": ${count} complaints`);
    });

    // Get all departments
    const departments = await Department.find({ isActive: true });
    
    console.log('\n🏢 DEPARTMENTS AND THEIR EXPECTED TYPES:');
    departments.forEach(dept => {
      console.log(`   ${dept.name}:`);
      dept.complaintTypes.forEach(type => {
        console.log(`      - "${type}"`);
      });
    });

    console.log('\n🔍 MISMATCH ANALYSIS:');
    const complaintTypes = Object.keys(typeCount);
    const departmentTypes = departments.flatMap(d => d.complaintTypes);
    
    complaintTypes.forEach(cType => {
      const hasMatch = departmentTypes.includes(cType);
      if (!hasMatch) {
        console.log(`   ❌ "${cType}" - NO MATCHING DEPARTMENT`);
        // Find close matches
        departmentTypes.forEach(dType => {
          if (cType.includes(dType) || dType.includes(cType)) {
            console.log(`      💡 Close match: "${dType}"`);
          }
        });
      } else {
        console.log(`   ✅ "${cType}" - HAS MATCHING DEPARTMENT`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkComplaintTypes();
