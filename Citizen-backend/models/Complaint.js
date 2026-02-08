// models/Complaint.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
    },
    type: {
      type: String,
      required: [true, "Complaint type is required"],
    },
    description: {
      type: String,
    },
    photoPath: {
      type: String,
      required: [true, "Photo is required"],
    },
    status: {
      type: String,
      enum: ["analyzing", "pending", "in_progress", "resolved", "rejected"],
      default: "pending",
    },
    location: {
      type: String,
    },
    // Geo-location fields
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
    autoDetectedLocation: {
      type: String,
    },
    manualLocation: {
      type: String,
    },
    // Department Assignment
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Officer",
    },
    assignedAt: {
      type: Date,
    },
    // NEW: AI Analysis Fields
    aiAnalysis: {
      severity: {
        type: Number,
        min: 0,
        max: 100,
      },
      priorityLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
      },
      priorityScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      aiDescription: String,
      detectedIssues: [String],
      verificationStatus: {
        type: String,
        enum: ['verified', 'mismatch', 'uncertain'],
      },
      confidence: Number,
      analyzedAt: Date,
      // Additional type-specific fields
      cleanupEffort: Number,
      healthConcerns: [String],
      damageType: String,
      estimatedSize: String,
      trafficImpact: String,
      safetyRisk: String,
      flowRate: String,
      estimatedWastage: Number,
      infrastructureRisk: String,
      outageExtent: String,
      safetyImpact: String,
      blockageType: String,
      overflowRisk: String,
      healthHazards: [String],
      aiError: Boolean,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
complaintSchema.index({ assignedDepartment: 1 });
complaintSchema.index({ assignedOfficer: 1 });
complaintSchema.index({ status: 1 });

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;

