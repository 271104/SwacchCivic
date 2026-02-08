// models/Department.js
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    complaintTypes: {
      type: [String],
      required: true,
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
