// scripts/reanalyzeComplaints.js
// Re-analyze existing complaints with AI after fixing the API key
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const { analyzeComplaintImage } = require('../services/aiAnalysisService');
const { calculatePriorityScore } = require('../utils/priorityCalculator');
const { assignComplaintToDepartment } = require('../services/departmentAssignment');
require('dotenv').config();

async function reanalyzeComplaints() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    console.log('✅ Connected to MongoDB');
    console.log('📌 DB Name:', mongoose.connection.name);

    // Get all complaints with AI errors
    const complaints = await Complaint.find({
      $or: [
        { 'aiAnalysis.aiError': true },
        { 'aiAnalysis.confidence': 0 }
      ]
    });

    console.log(`\n📋 Found ${complaints.length} complaints to re-analyze\n`);

    if (complaints.length === 0) {
      console.log('✅ No complaints need re-analysis!');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    for (const complaint of complaints) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Processing: ${complaint._id}`);
      console.log(`Current Type: ${complaint.type}`);
      console.log(`Photo: ${complaint.photoPath}`);

      try {
        // Re-analyze with AI
        console.log('🤖 Running AI analysis...');
        const aiAnalysis = await analyzeComplaintImage(
          complaint.photoPath,
          null,
          complaint.description || '',
          complaint.location || ''
        );

        // Calculate priority score
        const priorityScore = calculatePriorityScore(
          aiAnalysis,
          aiAnalysis.detectedComplaintType,
          complaint.location
        );

        // Update complaint type if different
        const newType = aiAnalysis.detectedComplaintType;
        if (newType !== complaint.type) {
          console.log(`📝 Updating type: "${complaint.type}" → "${newType}"`);
          complaint.type = newType;
        }

        // Update AI analysis
        complaint.aiAnalysis = {
          severity: aiAnalysis.severity,
          priorityLevel: aiAnalysis.priorityLevel,
          priorityScore: priorityScore,
          aiDescription: aiAnalysis.description,
          detectedIssues: aiAnalysis.detectedIssues,
          confidence: aiAnalysis.confidence,
          analyzedAt: new Date(),
          aiError: false
        };

        // Re-assign department based on new type
        const department = await assignComplaintToDepartment(newType);
        if (department) {
          complaint.assignedDepartment = department;
          complaint.assignedAt = new Date();
          console.log(`🏢 Assigned to department: ${department}`);
        }

        await complaint.save();

        console.log('✅ Successfully re-analyzed!');
        console.log(`   Type: ${newType}`);
        console.log(`   Severity: ${aiAnalysis.severity}%`);
        console.log(`   Priority: ${aiAnalysis.priorityLevel}`);
        console.log(`   Confidence: ${aiAnalysis.confidence}%`);

        successCount++;

      } catch (error) {
        console.error('❌ Failed to re-analyze:', error.message);
        failCount++;
      }
    }

    console.log(`\n\n📊 SUMMARY:`);
    console.log(`   Total complaints: ${complaints.length}`);
    console.log(`   Successfully re-analyzed: ${successCount}`);
    console.log(`   Failed: ${failCount}`);

    if (successCount > 0) {
      console.log('\n✅ Re-analysis completed successfully!');
    } else {
      console.log('\n⚠️  No complaints were successfully re-analyzed.');
      console.log('   Please check if the Gemini API key is valid.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

reanalyzeComplaints();
