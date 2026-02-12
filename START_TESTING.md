# 🧪 Start Testing - Quick Guide

Complete guide to start testing from scratch.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Clean Database
```bash
cd Citizen-backend
node scripts/cleanDatabase.js
```

**Output:**
```
✅ Connected to MongoDB
🗑️  Deleting all data...
   Citizens deleted: X
   Officers deleted: X
   Admins deleted: X
   Complaints deleted: X
   Departments deleted: X
✅ All data deleted successfully!
```

### Step 2: Seed Fresh Data
```bash
# Still in Citizen-backend folder
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

**Output:**
```
✅ 5 departments seeded successfully
✅ Admin created successfully
   Email: admin@solapurcorporation.gov.in
   Password: admin123
```

### Step 3: Start Servers
```bash
# Terminal 1 - Backend
cd Citizen-backend
node server.js

# Terminal 2 - Frontend
cd citizen-frontend-react
npm run dev
```

**Ready!** Open http://localhost:5173

---

## 📖 Testing Flow

### 1. Test Admin Portal
```
URL: http://localhost:5173/admin/login
Email: admin@solapurcorporation.gov.in
Password: admin123
```

**What to test:**
- Login
- View dashboard
- View departments (5 should be there)
- View officers (empty)
- View pending approvals (empty)

### 2. Register Officer
```
URL: http://localhost:5173/officer/register
Name: Test Officer 1
Email: officer1@test.com
Phone: 9876543210
Password: test123
Department: Roads and Infrastructure
```

**What to test:**
- Registration succeeds
- Cannot login yet (pending approval)
- Admin sees pending approval
- Admin approves officer
- Officer can now login

### 3. Register Citizen
```
URL: http://localhost:5173/register
Name: Test Citizen 1
Phone: 9999999999
Password: test123
```

**What to test:**
- Registration succeeds
- Can login
- Dashboard shows no complaints

### 4. Submit Complaints
```
Login as citizen, submit 3 complaints:

Complaint 1:
- Title: Pothole on MG Road
- Description: Large pothole causing accidents
- Location: MG Road, Solapur
- Type: Pothole

Complaint 2:
- Title: Street Light Not Working
- Description: Broken for 5 days
- Location: Station Road, Solapur
- Type: Street Light Repair

Complaint 3:
- Title: Garbage Not Collected
- Description: Not collected for 3 days
- Location: Budhwar Peth, Solapur
- Type: Garbage Collection
```

**What to test:**
- Each complaint submitted successfully
- AI analyzes each complaint
- Auto-assigned to correct department
- Priority calculated

### 5. Officer Handles Complaints
```
Login as officer (officer1@test.com / test123)
```

**What to test:**
- Sees only Roads department complaints
- Can update status to "In Progress"
- Can resolve complaints
- Citizen sees updated status

### 6. Admin Monitors
```
Login as admin
```

**What to test:**
- Statistics show correct counts
- Can see all officers
- Can see officer performance
- Can manage departments

---

## ✅ Success Criteria

After testing, you should have:

```
✅ 1 Admin (working)
✅ 1 Officer (approved, active)
✅ 1 Citizen (registered)
✅ 5 Departments (seeded)
✅ 3 Complaints (submitted, analyzed)
✅ AI analysis working
✅ Auto-assignment working
✅ Status updates working
✅ Statistics accurate
```

---

## 📚 Detailed Documentation

- **Complete Guide:** [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)
- **Quick Checklist:** [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- **URLs Reference:** [docs/URLS.md](docs/URLS.md)

---

## 🔄 Reset Database

To start fresh testing again:

```bash
cd Citizen-backend
node scripts/cleanDatabase.js
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

---

## 🐛 Troubleshooting

### Database not cleaning?
```bash
# Check MongoDB is running
mongosh

# Manually clean
use smc_db
db.dropDatabase()
```

### Servers not starting?
```bash
# Check ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

### AI not working?
```bash
# Check .env has Gemini API key
cd Citizen-backend
cat .env
# Should have: GEMINI_API_KEY=your_key_here
```

---

**Ready to test? Run Step 1 above!** 🚀
