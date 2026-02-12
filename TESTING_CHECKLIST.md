# ✅ Testing Checklist - Quick Reference

Quick checklist for testing the SMC Citizen Complaint Portal.

---

## 🚀 Quick Start

### 1. Clean Database
```bash
cd Citizen-backend
node scripts/cleanDatabase.js
```

### 2. Seed Fresh Data
```bash
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

### 3. Start Servers
```bash
# Terminal 1
cd Citizen-backend
node server.js

# Terminal 2
cd citizen-frontend-react
npm run dev
```

---

## 📋 Test Credentials

### Admin
```
URL: http://localhost:5173/admin/login
Email: admin@solapurcorporation.gov.in
Password: admin123
```

### Test Officer (After Registration & Approval)
```
URL: http://localhost:5173/officer/login
Email: officer1@test.com
Password: test123
Department: Roads and Infrastructure
```

### Test Citizen (After Registration)
```
URL: http://localhost:5173/login
Phone: 9999999999
Password: test123
```

---

## ✅ Testing Checklist

### Phase 1: Admin Portal ✓
- [ ] Login as admin
- [ ] View dashboard (all zeros initially)
- [ ] View 5 departments
- [ ] View officers (empty initially)
- [ ] View pending approvals (empty initially)
- [ ] View statistics

### Phase 2: Officer Registration ✓
- [ ] Register new officer
- [ ] Try to login (should fail - pending approval)
- [ ] Admin approves officer
- [ ] Officer can now login
- [ ] Officer sees dashboard

### Phase 3: Citizen Registration ✓
- [ ] Register new citizen
- [ ] Login as citizen
- [ ] View dashboard (no complaints yet)

### Phase 4: Complaint Submission ✓
- [ ] Submit complaint #1 (Roads - Pothole)
- [ ] Verify AI analysis
- [ ] Verify auto-assignment to Roads dept
- [ ] Submit complaint #2 (Street Lighting)
- [ ] Submit complaint #3 (Waste Management)

### Phase 5: Officer Handles Complaints ✓
- [ ] Officer views assigned complaints
- [ ] Officer updates status to "In Progress"
- [ ] Officer resolves complaint
- [ ] Citizen sees updated status

### Phase 6: Admin Monitoring ✓
- [ ] Admin views updated statistics
- [ ] Admin sees officer performance
- [ ] Admin manages departments

---

## 🎯 Expected Results

### After Complete Testing

**Database:**
- Citizens: 1
- Officers: 1 (approved)
- Admins: 1
- Departments: 5
- Complaints: 3 (1 resolved, 2 pending)

**Features Verified:**
- ✅ User registration (all roles)
- ✅ Authentication (all roles)
- ✅ Officer approval workflow
- ✅ Complaint submission
- ✅ AI analysis
- ✅ Auto-assignment
- ✅ Status updates
- ✅ Statistics

---

## 🔄 Reset for Fresh Testing

```bash
cd Citizen-backend
node scripts/cleanDatabase.js
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

---

## 📖 Detailed Guide

For complete step-by-step instructions, see: [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)

---

**Ready to test? Start with cleaning the database!** 🚀
