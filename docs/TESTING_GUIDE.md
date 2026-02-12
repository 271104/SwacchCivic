# 🧪 Complete Testing Guide

Step-by-step guide to test the SMC Citizen Complaint Portal from scratch.

---

## 📋 Pre-Testing Setup

### Step 1: Clean Database (Delete All Data)

#### Option A: Using MongoDB Compass (Recommended)
1. Open MongoDB Compass
2. Connect to: `mongodb://127.0.0.1:27017`
3. Select database: `smc_db`
4. For each collection, click and select "Delete Collection":
   - `citizens` - Delete
   - `officers` - Delete
   - `admins` - Delete
   - `complaints` - Delete
   - `departments` - Delete

#### Option B: Using MongoDB Shell
```bash
# Open MongoDB shell
mongosh

# Switch to database
use smc_db

# Delete all data from collections
db.citizens.deleteMany({})
db.officers.deleteMany({})
db.admins.deleteMany({})
db.complaints.deleteMany({})
db.departments.deleteMany({})

# Verify all collections are empty
db.citizens.countDocuments()    # Should return 0
db.officers.countDocuments()    # Should return 0
db.admins.countDocuments()      # Should return 0
db.complaints.countDocuments()  # Should return 0
db.departments.countDocuments() # Should return 0

# Exit
exit
```

#### Option C: Using Script (Quick)
Create a file `Citizen-backend/scripts/cleanDatabase.js`:
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smc_db';

async function cleanDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all data
    await mongoose.connection.db.collection('citizens').deleteMany({});
    await mongoose.connection.db.collection('officers').deleteMany({});
    await mongoose.connection.db.collection('admins').deleteMany({});
    await mongoose.connection.db.collection('complaints').deleteMany({});
    await mongoose.connection.db.collection('departments').deleteMany({});

    console.log('✅ All data deleted successfully');

    // Verify
    const citizenCount = await mongoose.connection.db.collection('citizens').countDocuments();
    const officerCount = await mongoose.connection.db.collection('officers').countDocuments();
    const adminCount = await mongoose.connection.db.collection('admins').countDocuments();
    const complaintCount = await mongoose.connection.db.collection('complaints').countDocuments();
    const deptCount = await mongoose.connection.db.collection('departments').countDocuments();

    console.log('\n📊 Database Status:');
    console.log(`Citizens: ${citizenCount}`);
    console.log(`Officers: ${officerCount}`);
    console.log(`Admins: ${adminCount}`);
    console.log(`Complaints: ${complaintCount}`);
    console.log(`Departments: ${deptCount}`);

    await mongoose.disconnect();
    console.log('\n✅ Database cleaned and ready for testing!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
```

Run it:
```bash
cd Citizen-backend
node scripts/cleanDatabase.js
```

---

### Step 2: Seed Fresh Data

```bash
cd Citizen-backend

# Seed departments (5 departments)
node scripts/seedDepartments.js

# Create admin account
node scripts/createAdmin.js
```

**Expected Output:**
```
✅ 5 departments seeded successfully
✅ Admin created successfully
   Email: admin@solapurcorporation.gov.in
   Password: admin123
```

---

### Step 3: Start Servers

#### Terminal 1 - Backend
```bash
cd Citizen-backend
node server.js
```

**Wait for:**
```
✅ MongoDB connected
📌 DB Name: smc_db
🚀 Server running on port 5000
```

#### Terminal 2 - Frontend
```bash
cd citizen-frontend-react
npm run dev
```

**Wait for:**
```
Local: http://localhost:5173/
```

---

## 🧪 Testing Workflow

### Phase 1: Admin Portal Testing

#### Test 1.1: Admin Login
1. Open: http://localhost:5173/admin/login
2. Enter credentials:
   - Email: `admin@solapurcorporation.gov.in`
   - Password: `admin123`
3. Click "Sign In"

**Expected Result:**
- ✅ Redirects to admin dashboard
- ✅ Shows "Welcome, System Administrator"
- ✅ Shows statistics (all zeros initially)

#### Test 1.2: View Departments
1. Click "Departments" in sidebar
2. Verify 5 departments are listed:
   - Roads and Infrastructure
   - Water Supply
   - Waste Management
   - Street Lighting
   - Public Health

**Expected Result:**
- ✅ All 5 departments visible
- ✅ Each shows complaint types
- ✅ All marked as "Active"

#### Test 1.3: View Officers (Empty)
1. Click "Officers" in sidebar

**Expected Result:**
- ✅ Shows "No officers found"
- ✅ No errors

#### Test 1.4: View Pending Approvals (Empty)
1. Click "Pending Approvals" in sidebar

**Expected Result:**
- ✅ Shows "All Caught Up! No pending officer approvals"
- ✅ No errors

#### Test 1.5: View Statistics
1. Click "Statistics" in sidebar

**Expected Result:**
- ✅ All counts show 0
- ✅ No errors

---

### Phase 2: Officer Registration & Approval

#### Test 2.1: Officer Registration
1. **Logout from admin** (click logout)
2. Open: http://localhost:5173/officer/register
3. Fill in details:
   - Name: `Test Officer 1`
   - Email: `officer1@test.com`
   - Phone: `9876543210`
   - Password: `test123`
   - Department: Select "Roads and Infrastructure"
4. Click "Create Account"

**Expected Result:**
- ✅ Success message: "Registration submitted. Awaiting admin approval"
- ✅ Redirects to officer login page

#### Test 2.2: Officer Login (Should Fail - Pending Approval)
1. At officer login page
2. Enter:
   - Email: `officer1@test.com`
   - Password: `test123`
3. Click "Sign In"

**Expected Result:**
- ❌ Error: "Your account is pending approval. Please wait for admin approval."
- ✅ Cannot login yet

#### Test 2.3: Admin Approves Officer
1. Open: http://localhost:5173/admin/login
2. Login as admin
3. Click "Pending Approvals"
4. Verify officer appears:
   - Name: Test Officer 1
   - Email: officer1@test.com
   - Department: Roads and Infrastructure
5. Click "Approve" button
6. Confirm approval

**Expected Result:**
- ✅ Success message
- ✅ Officer disappears from pending list
- ✅ Officer appears in "Officers" page with status "Active"

#### Test 2.4: Officer Login (Should Succeed)
1. Logout from admin
2. Open: http://localhost:5173/officer/login
3. Enter:
   - Email: `officer1@test.com`
   - Password: `test123`
4. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirects to officer dashboard
- ✅ Shows "Welcome, Test Officer 1"
- ✅ Shows "No complaints assigned yet"

---

### Phase 3: Citizen Registration & Complaint Submission

#### Test 3.1: Citizen Registration
1. Logout from officer
2. Open: http://localhost:5173/register
3. Fill in details:
   - Name: `Test Citizen 1`
   - Phone: `9999999999`
   - Password: `test123`
4. Click "Create Account"

**Expected Result:**
- ✅ Success message: "Registration successful! Please login"
- ✅ Redirects to login page

#### Test 3.2: Citizen Login
1. At login page
2. Enter:
   - Phone: `9999999999`
   - Password: `test123`
3. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirects to citizen dashboard
- ✅ Shows "Welcome, Test Citizen 1"
- ✅ Shows "No complaints yet"

#### Test 3.3: Submit Complaint (Roads)
1. Click "Register Complaint" in navigation
2. Fill in form:
   - Title: `Pothole on MG Road`
   - Description: `Large pothole near City Mall causing accidents. Needs immediate repair.`
   - Location: `MG Road, Near City Mall, Solapur`
   - Type: Select "Pothole"
   - Image: Upload any image (optional)
3. Click "Submit Complaint"

**Expected Result:**
- ✅ Success message
- ✅ Redirects to "My Complaints"
- ✅ Complaint appears with:
  - Status: "Pending"
  - Priority: 3 or 4 (AI-calculated)
  - Department: "Roads and Infrastructure" (auto-assigned)
  - AI Analysis visible

#### Test 3.4: Submit More Complaints
Repeat Test 3.3 with different types:

**Complaint 2:**
- Title: `Street Light Not Working`
- Description: `Street light broken for 5 days. Area is dark at night.`
- Location: `Station Road, Solapur`
- Type: "Street Light Repair"

**Complaint 3:**
- Title: `Garbage Not Collected`
- Description: `Garbage not collected for 3 days. Bad smell.`
- Location: `Budhwar Peth, Solapur`
- Type: "Garbage Collection"

**Expected Result:**
- ✅ Each complaint auto-assigned to correct department
- ✅ Each has AI analysis
- ✅ Each has priority calculated

---

### Phase 4: Officer Handles Complaints

#### Test 4.1: Officer Views Assigned Complaints
1. Logout from citizen
2. Login as officer (officer1@test.com / test123)
3. View dashboard

**Expected Result:**
- ✅ Shows complaint count
- ✅ Shows "Pothole on MG Road" (assigned to Roads dept)
- ✅ Does NOT show other complaints (different departments)

#### Test 4.2: Officer Updates Complaint Status
1. Click on "Pothole on MG Road" complaint
2. Click "Update Status" or status dropdown
3. Change status to "In Progress"
4. Click "Update"

**Expected Result:**
- ✅ Status updated successfully
- ✅ Complaint shows "In Progress" badge
- ✅ Citizen can see updated status

#### Test 4.3: Officer Resolves Complaint
1. Click on same complaint
2. Change status to "Resolved"
3. Click "Update"

**Expected Result:**
- ✅ Status updated to "Resolved"
- ✅ Complaint moves to "Resolved Complaints" section
- ✅ Citizen sees "Resolved" status

---

### Phase 5: Admin Monitors System

#### Test 5.1: Admin Views Statistics
1. Logout from officer
2. Login as admin
3. Click "Statistics"

**Expected Result:**
- ✅ Total Complaints: 3
- ✅ Pending: 2
- ✅ In Progress: 0
- ✅ Resolved: 1
- ✅ Total Citizens: 1
- ✅ Total Officers: 1
- ✅ Department breakdown visible

#### Test 5.2: Admin Views All Officers
1. Click "Officers"

**Expected Result:**
- ✅ Shows Test Officer 1
- ✅ Shows statistics (1 total, 1 resolved, 0 pending)
- ✅ Status: Active

#### Test 5.3: Admin Manages Departments
1. Click "Departments"
2. Click "Edit" on any department
3. Add a new complaint type
4. Click "Update"

**Expected Result:**
- ✅ Department updated
- ✅ New complaint type available for citizens

---

## 📊 Complete Test Checklist

### Admin Portal
- [ ] Admin can login
- [ ] Admin can view dashboard
- [ ] Admin can view all departments
- [ ] Admin can create/edit/delete departments
- [ ] Admin can view pending officer approvals
- [ ] Admin can approve officers
- [ ] Admin can reject officers
- [ ] Admin can view all officers
- [ ] Admin can revoke officer access
- [ ] Admin can activate inactive officers
- [ ] Admin can view statistics
- [ ] Admin can logout

### Officer Portal
- [ ] Officer can register
- [ ] Officer cannot login before approval
- [ ] Officer can login after approval
- [ ] Officer can view dashboard
- [ ] Officer can view assigned complaints
- [ ] Officer can update complaint status
- [ ] Officer can resolve complaints
- [ ] Officer can view resolved complaints
- [ ] Officer can logout

### Citizen Portal
- [ ] Citizen can register
- [ ] Citizen can login
- [ ] Citizen can view dashboard
- [ ] Citizen can submit complaint
- [ ] Complaint auto-assigns to department
- [ ] AI analyzes complaint
- [ ] Priority is calculated
- [ ] Citizen can view all their complaints
- [ ] Citizen can see status updates
- [ ] Citizen can logout

### AI Features
- [ ] Complaint type extracted correctly
- [ ] Priority calculated (1-5)
- [ ] Department auto-assigned
- [ ] AI analysis summary generated

### Security
- [ ] Cannot access admin routes without admin login
- [ ] Cannot access officer routes without officer login
- [ ] Cannot access citizen routes without citizen login
- [ ] Passwords are hashed
- [ ] JWT tokens work correctly
- [ ] Logout clears tokens

---

## 🔄 Test Data Summary

After complete testing, you should have:

### Database Contents
```
Citizens: 1
- Test Citizen 1 (9999999999)

Officers: 1
- Test Officer 1 (officer1@test.com) - Roads dept

Admins: 1
- System Administrator (admin@solapurcorporation.gov.in)

Departments: 5
- Roads and Infrastructure
- Water Supply
- Waste Management
- Street Lighting
- Public Health

Complaints: 3
- Pothole on MG Road (Resolved)
- Street Light Not Working (Pending)
- Garbage Not Collected (Pending)
```

---

## 🧹 Clean Up After Testing

To reset for fresh testing:

```bash
cd Citizen-backend
node scripts/cleanDatabase.js
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

---

## 🐛 Common Issues During Testing

### Issue: "Failed to load officers"
**Solution:** Clear browser localStorage and login again

### Issue: "Invalid credentials"
**Solution:** Verify you're using correct credentials for each role

### Issue: "Department not assigned"
**Solution:** Check AI service is working, verify Gemini API key

### Issue: "Cannot upload image"
**Solution:** Check uploads folder exists and has write permissions

### Issue: "Token expired"
**Solution:** Login again to get fresh token

---

## 📝 Testing Notes Template

Use this template to document your testing:

```
Date: ___________
Tester: ___________

Phase 1: Admin Portal
- Admin Login: ✅/❌
- View Departments: ✅/❌
- Approve Officer: ✅/❌
- View Statistics: ✅/❌
Notes: ___________

Phase 2: Officer Portal
- Officer Register: ✅/❌
- Officer Login: ✅/❌
- View Complaints: ✅/❌
- Update Status: ✅/❌
Notes: ___________

Phase 3: Citizen Portal
- Citizen Register: ✅/❌
- Citizen Login: ✅/❌
- Submit Complaint: ✅/❌
- View Complaints: ✅/❌
Notes: ___________

Phase 4: AI Features
- Auto-categorization: ✅/❌
- Priority calculation: ✅/❌
- Department assignment: ✅/❌
Notes: ___________

Issues Found:
1. ___________
2. ___________

Overall Status: ✅ Pass / ❌ Fail
```

---

## 🎯 Success Criteria

Testing is successful if:
- ✅ All user roles can register and login
- ✅ Admin can approve officers
- ✅ Citizens can submit complaints
- ✅ AI analyzes complaints correctly
- ✅ Officers can update complaint status
- ✅ Statistics display correctly
- ✅ No console errors
- ✅ All features work as expected

---

**Ready to test? Start with Step 1: Clean Database!** 🚀
