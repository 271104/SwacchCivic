// services/departmentAssignment.js
const Department = require('../models/Department');

/**
 * Automatically assigns a complaint to the appropriate department based on complaint type
 * @param {String} complaintType - The type of complaint (e.g., "Garbage", "Road Damage")
 * @returns {Promise<ObjectId|null>} - Department ID or null if not found
 */
async function assignComplaintToDepartment(complaintType) {
  try {
    // Find active department that handles this complaint type
    const department = await Department.findOne({
      complaintTypes: complaintType,
      isActive: true
    });

    if (!department) {
      console.warn(`⚠️  No active department found for complaint type: ${complaintType}`);
      return null;
    }

    console.log(`✅ Assigned complaint type "${complaintType}" to ${department.name}`);
    return department._id;
  } catch (error) {
    console.error('❌ Error in department assignment:', error);
    return null;
  }
}

/**
 * Get department mapping for all complaint types
 * @returns {Promise<Object>} - Mapping of complaint types to departments
 */
async function getDepartmentMapping() {
  try {
    const departments = await Department.find({ isActive: true });
    
    const mapping = {};
    departments.forEach(dept => {
      dept.complaintTypes.forEach(type => {
        mapping[type] = {
          id: dept._id,
          name: dept.name,
          description: dept.description
        };
      });
    });

    return mapping;
  } catch (error) {
    console.error('❌ Error getting department mapping:', error);
    return {};
  }
}

module.exports = {
  assignComplaintToDepartment,
  getDepartmentMapping
};
