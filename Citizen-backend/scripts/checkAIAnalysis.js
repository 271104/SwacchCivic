// scripts/checkAIAnalysis.js
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
require('dotenv').config();

async function checkAIAnalysis() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    const complaints = await Complaint.find({})
      .populate('assignedDepartment', 'name')
      .sort({ createdAt: -1 });

    console.log(`\n📋 FOUND ${complaints.length} COMPLAINTS\n`);

    complaints.forEach((c, index) => {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`COMPLAINT #${index + 1}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`ID: ${c._id}`);
      console.log(`Type: "${c.type}"`);
      console.log(`Status: ${c.status}`);
      console.log(`Location: ${c.location || 'N/A'}`);
      console.log(`Department: ${c.assignedDepartment ? c.assignedDepartment.name : 'UNASSIGNED'}`);
      console.log(`Created: ${c.createdAt.toLocaleString()}`);
      
      if (c.aiAnalysis) {
        console.log(`\n🤖 AI ANALYSIS:`);
        console.log(`   Severity: ${c.aiAnalysis.severity}%`);
        console.log(`   Priority Level: ${c.aiAnalysis.priorityLevel}`);
        console.log(`   Priority Score: ${c.aiAnalysis.priorityScore}`);
        console.log(`   Confidence: ${c.aiAnalysis.confidence}%`);
        console.log(`   Description: ${c.aiAnalysis.aiDescription || 'N/A'}`);
        console.log(`   Detected Issues: ${c.aiAnalysis.detectedIssues?.join(', ') || 'None'}`);
        console.log(`   AI Error: ${c.aiAnalysis.aiError ? 'YES' : 'NO'}`);
      } else {
        console.log(`\n⚠️  NO AI ANALYSIS DATA`);
      }
    });

    console.log(`\n\n📊 SUMMARY:`);
    const typeCount = {};
    const deptCount = {};
    const priorityCount = {};
    
    complaints.forEach(c => {
      typeCount[c.type] = (typeCount[c.type] || 0) + 1;
      
      const dept = c.assignedDepartment ? c.assignedDepartment.name : 'Unassigned';
      deptCount[dept] = (deptCount[dept] || 0) + 1;
      
      const priority = c.aiAnalysis?.priorityLevel || 'unknown';
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;
    });

    console.log(`\n📋 BY TYPE:`);
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    console.log(`\n🏢 BY DEPARTMENT:`);
    Object.entries(deptCount).forEach(([dept, count]) => {
      console.log(`   ${dept}: ${count}`);
    });

    console.log(`\n⚡ BY PRIORITY:`);
    Object.entries(priorityCount).forEach(([priority, count]) => {
      console.log(`   ${priority}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAIAnalysis();
