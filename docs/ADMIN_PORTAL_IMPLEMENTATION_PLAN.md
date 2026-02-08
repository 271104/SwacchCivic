# Admin Portal Implementation Plan

## Overview
This document outlines the complete implementation plan for the Admin Portal with Department Management, Officer Approval System, and Statistical Dashboards.

**Estimated Time**: 2-3 weeks  
**Complexity**: High  
**Priority**: High

---

## Phase 1: Backend Foundation (Week 1)

### 1.1 Database Models ✅ STARTED
**Files to Create/Update:**
- ✅ `Citizen-backend/models/Department.js` - Created
- ✅ `Citizen-backend/models/User.js` - Updated with email, department, status
- `Citizen-backend/models/Complaint.js` - Add assignedDepartment field

**Tasks:**
- [x] Create Department model
- [x] Update User model with officer fields
- [ ] Update Complaint model with department assignment
- [ ] Create database indexes
- [ ] Create seed script for initial departments

### 1.2 Department Management API
**File**: `Citizen-backend/routes/admin/departments.js`

**Endpoints to Create:**
```javascript
GET    /api/admin/departments          // List all departments
POST   /api/admin/departments          // Create department
GET    /api/admin/departments/:id      // Get department details
PUT    /api/admin/departments/:id      // Update department
DELETE /api/admin/departments/:id      // Deactivate department
```

### 1.3 Officer Management API
**File**: `Citizen-backend/routes/admin/officers.js`

**Endpoints to Create:**
```javascript
GET    /api/admin/officers/pending     // Get pending approvals
GET    /api/admin/officers              // Get all officers
GET    /api/admin/officers/:id          // Get officer details
PUT    /api/admin/officers/:id/approve  // Approve officer
PUT    /api/admin/officers/:id/reject   // Reject officer
PUT    /api/admin/officers/:id/revoke   // Revoke access
PUT    /api/admin/officers/:id/activate // Reactivate officer
PUT    /api/admin/officers/:id/department // Change department
DELETE /api/admin/officers/:id          // Delete officer
```

### 1.4 Admin Authentication
**File**: `Citizen-backend/routes/admin/auth.js`

**Endpoints to Create:**
```javascript
POST   /api/admin/login                // Admin login
POST   /api/admin/register             // Create admin (super admin only)
```

### 1.5 Statistics API
**File**: `Citizen-backend/routes/admin/statistics.js`

**Endpoints to Create:**
```javascript
GET    /api/admin/stats/overview       // System-wide stats
GET    /api/admin/stats/departments    // All departments stats
GET    /api/admin/stats/departments/:id // Specific department
GET    /api/admin/stats/officers       // All officers stats
GET    /api/admin/stats/officers/:id   // Specific officer
```

### 1.6 Middleware Updates
**Files to Update:**
- `Citizen-backend/middleware/auth.js` - Support admin role
- `Citizen-backend/middleware/role.js` - Add admin checks
- Create `Citizen-backend/middleware/adminAuth.js` - Admin-only middleware

### 1.7 Auto-Assignment Logic
**File**: `Citizen-backend/services/departmentAssignment.js`

**Function to Create:**
```javascript
async function assignComplaintToDepartment(complaintType) {
  // Map complaint type to department
  // Return department ID
}
```

**Update**: `Citizen-backend/routes/complaints.js`
- Add auto-assignment on complaint creation

---

## Phase 2: Frontend - Admin Portal (Week 2)

### 2.1 Admin Authentication Pages
**Files to Create:**
- `citizen-frontend-react/src/pages/admin/Login.jsx`
- `citizen-frontend-react/src/context/AdminContext.jsx`

### 2.2 Admin Dashboard
**File**: `citizen-frontend-react/src/pages/admin/Dashboard.jsx`

**Components:**
- Overview cards (Total Complaints, Officers, Departments)
- Recent activity feed
- Quick stats
- Navigation to sub-sections

### 2.3 Department Management
**Files to Create:**
- `citizen-frontend-react/src/pages/admin/Departments.jsx`
- `citizen-frontend-react/src/components/admin/DepartmentCard.jsx`
- `citizen-frontend-react/src/components/admin/DepartmentForm.jsx`

**Features:**
- List all departments
- Create new department
- Edit department
- Activate/Deactivate
- View assigned officers count
- View complaint types mapping

### 2.4 Officer Management
**Files to Create:**
- `citizen-frontend-react/src/pages/admin/Officers.jsx`
- `citizen-frontend-react/src/pages/admin/PendingApprovals.jsx`
- `citizen-frontend-react/src/components/admin/OfficerCard.jsx`
- `citizen-frontend-react/src/components/admin/ApprovalCard.jsx`

**Features:**
- List all officers (with filters)
- Pending approvals with badge
- Approve/Reject officers
- Revoke/Reactivate access
- Change department
- Delete officer
- Search and filter

### 2.5 Statistics Dashboard
**Files to Create:**
- `citizen-frontend-react/src/pages/admin/Statistics.jsx`
- `citizen-frontend-react/src/pages/admin/DepartmentStats.jsx`
- `citizen-frontend-react/src/pages/admin/OfficerStats.jsx`
- `citizen-frontend-react/src/components/admin/charts/BarChart.jsx`
- `citizen-frontend-react/src/components/admin/charts/PieChart.jsx`
- `citizen-frontend-react/src/components/admin/charts/LineChart.jsx`

**Charts to Implement:**
1. **Complaints by Department** (Bar Chart)
2. **Status Distribution** (Pie Chart per department)
3. **Complaints Over Time** (Line Chart)
4. **Resolution Time by Department** (Bar Chart)
5. **Officer Performance** (Leaderboard)
6. **Priority Distribution** (Pie Chart)

**Libraries:**
- Install: `npm install recharts` or `npm install chart.js react-chartjs-2`

### 2.6 Admin Components
**Files to Create:**
- `citizen-frontend-react/src/components/admin/AdminHeader.jsx`
- `citizen-frontend-react/src/components/admin/AdminSidebar.jsx`
- `citizen-frontend-react/src/components/admin/StatCard.jsx`
- `citizen-frontend-react/src/components/admin/DataTable.jsx`

### 2.7 Admin API Service
**File**: `citizen-frontend-react/src/services/adminAPI.js`

**Functions to Create:**
```javascript
export const adminAPI = {
  // Auth
  login: (data) => api.post('/admin/login', data),
  
  // Departments
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  
  // Officers
  getPendingOfficers: () => api.get('/admin/officers/pending'),
  getAllOfficers: () => api.get('/admin/officers'),
  approveOfficer: (id) => api.put(`/admin/officers/${id}/approve`),
  rejectOfficer: (id) => api.put(`/admin/officers/${id}/reject`),
  revokeOfficer: (id) => api.put(`/admin/officers/${id}/revoke`),
  activateOfficer: (id) => api.put(`/admin/officers/${id}/activate`),
  changeDepartment: (id, deptId) => api.put(`/admin/officers/${id}/department`, { departmentId: deptId }),
  deleteOfficer: (id) => api.delete(`/admin/officers/${id}`),
  
  // Statistics
  getOverviewStats: () => api.get('/admin/stats/overview'),
  getDepartmentStats: () => api.get('/admin/stats/departments'),
  getOfficerStats: () => api.get('/admin/stats/officers'),
};
```

---

## Phase 3: Officer Updates (Week 2-3)

### 3.1 Officer Registration Update
**File**: `citizen-frontend-react/src/pages/officer/Register.jsx`

**Updates:**
- Add email field (required)
- Add department dropdown
- Show "Pending Approval" message after registration
- Cannot login until approved

### 3.2 Officer Login Update
**File**: `citizen-frontend-react/src/pages/officer/Login.jsx`

**Updates:**
- Login with email instead of phone
- Check officer status (must be "active")
- Show appropriate error messages for pending/rejected

### 3.3 Officer Dashboard Update
**File**: `citizen-frontend-react/src/pages/officer/Dashboard.jsx`

**Updates:**
- Show department name
- Show only department-specific complaints

### 3.4 Complaints Filtering
**Files to Update:**
- `citizen-frontend-react/src/pages/officer/PendingComplaints.jsx`
- `citizen-frontend-react/src/pages/officer/ResolvedComplaints.jsx`

**Updates:**
- Filter complaints by officer's department
- Show department badge on complaints

---

## Phase 4: Database Setup & Seeding

### 4.1 Create Seed Script
**File**: `Citizen-backend/scripts/seedDepartments.js`

```javascript
const departments = [
  {
    name: "Sanitation Department",
    description: "Handles garbage collection and waste management",
    complaintTypes: ["Garbage"],
    isActive: true
  },
  {
    name: "Roads & Infrastructure Department",
    description: "Manages road maintenance and repairs",
    complaintTypes: ["Road Damage"],
    isActive: true
  },
  {
    name: "Water Supply Department",
    description: "Handles water supply and leakage issues",
    complaintTypes: ["Water Leakage"],
    isActive: true
  },
  {
    name: "Electrical Department",
    description: "Manages street lights and electrical infrastructure",
    complaintTypes: ["Street Light"],
    isActive: true
  },
  {
    name: "Drainage & Sewerage Department",
    description: "Handles drainage and sewerage systems",
    complaintTypes: ["Drainage"],
    isActive: true
  }
];
```

### 4.2 Create Admin Account Script
**File**: `Citizen-backend/scripts/createAdmin.js`

```javascript
// Create default admin account
const admin = {
  name: "SMC Admin",
  email: "admin@solapurcorporation.gov.in",
  phone: "0217-2735293",
  password: "admin123", // Will be hashed
  role: "admin",
  status: "active"
};
```

### 4.3 Migration Script
**File**: `Citizen-backend/scripts/migrateExistingData.js`

- Update existing officers with default department
- Update existing complaints with department assignment
- Set existing officers to "active" status

---

## Phase 5: Testing & Deployment

### 5.1 Backend Testing
- Test all admin API endpoints
- Test officer approval flow
- Test department assignment logic
- Test statistics calculations
- Test role-based access control

### 5.2 Frontend Testing
- Test admin login and authentication
- Test department CRUD operations
- Test officer approval workflow
- Test statistics dashboard loading
- Test charts rendering
- Test responsive design

### 5.3 Integration Testing
- Test complete officer registration → approval → login flow
- Test complaint creation → auto-assignment → officer view
- Test admin actions and their effects
- Test concurrent admin operations

### 5.4 Performance Testing
- Test statistics query performance with large datasets
- Test pagination for officer lists
- Test chart rendering with many data points

---

## Implementation Checklist

### Backend
- [ ] Create Department model
- [ ] Update User model
- [ ] Update Complaint model
- [ ] Create admin authentication routes
- [ ] Create department management routes
- [ ] Create officer management routes
- [ ] Create statistics routes
- [ ] Create admin middleware
- [ ] Implement auto-assignment logic
- [ ] Create seed scripts
- [ ] Create migration scripts
- [ ] Add database indexes
- [ ] Test all endpoints

### Frontend
- [ ] Install chart library (recharts)
- [ ] Create admin login page
- [ ] Create admin dashboard
- [ ] Create department management page
- [ ] Create officer management page
- [ ] Create pending approvals page
- [ ] Create statistics dashboard
- [ ] Create department stats page
- [ ] Create officer stats page
- [ ] Create all chart components
- [ ] Create admin API service
- [ ] Update officer registration
- [ ] Update officer login
- [ ] Update officer dashboard
- [ ] Update complaint filtering
- [ ] Add admin routes to App.jsx
- [ ] Test all pages

### Documentation
- [ ] Update API documentation
- [ ] Create admin user guide
- [ ] Update officer user guide
- [ ] Update system workflow documentation
- [ ] Create deployment guide

---

## File Structure

```
Citizen-backend/
├── models/
│   ├── Department.js ✅
│   ├── User.js ✅
│   └── Complaint.js (update)
├── routes/
│   └── admin/
│       ├── auth.js
│       ├── departments.js
│       ├── officers.js
│       └── statistics.js
├── middleware/
│   └── adminAuth.js
├── services/
│   └── departmentAssignment.js
└── scripts/
    ├── seedDepartments.js
    ├── createAdmin.js
    └── migrateExistingData.js

citizen-frontend-react/
├── src/
│   ├── pages/
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Departments.jsx
│   │       ├── Officers.jsx
│   │       ├── PendingApprovals.jsx
│   │       ├── Statistics.jsx
│   │       ├── DepartmentStats.jsx
│   │       └── OfficerStats.jsx
│   ├── components/
│   │   └── admin/
│   │       ├── AdminHeader.jsx
│   │       ├── AdminSidebar.jsx
│   │       ├── DepartmentCard.jsx
│   │       ├── DepartmentForm.jsx
│   │       ├── OfficerCard.jsx
│   │       ├── ApprovalCard.jsx
│   │       ├── StatCard.jsx
│   │       ├── DataTable.jsx
│   │       └── charts/
│   │           ├── BarChart.jsx
│   │           ├── PieChart.jsx
│   │           └── LineChart.jsx
│   ├── context/
│   │   └── AdminContext.jsx
│   └── services/
│       └── adminAPI.js
```

---

## Next Steps

**Option 1: Full Implementation**
- Implement all phases sequentially
- Estimated time: 2-3 weeks
- Requires dedicated development time

**Option 2: Phased Rollout**
- Phase 1: Department setup + Auto-assignment (Week 1)
- Phase 2: Officer approval system (Week 2)
- Phase 3: Statistics dashboard (Week 3)

**Option 3: MVP First**
- Implement basic department management
- Implement officer approval
- Skip advanced statistics initially
- Estimated time: 1 week

---

## Recommendation

Given the scope, I recommend **Option 2: Phased Rollout**

**Week 1 Priority:**
1. Create departments (backend + seed data)
2. Implement auto-assignment logic
3. Update officer registration with email + department
4. Basic admin login and department list view

**Week 2 Priority:**
1. Officer approval system (backend + frontend)
2. Admin dashboard with pending approvals
3. Officer management (approve/reject/revoke)

**Week 3 Priority:**
1. Statistics API
2. Charts and dashboards
3. Performance metrics

This allows the system to be functional after Week 1, with incremental improvements in subsequent weeks.

---

**Created**: February 8, 2026  
**Status**: Planning Complete - Ready for Implementation
