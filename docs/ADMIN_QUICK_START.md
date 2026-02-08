# Admin Portal - Quick Start Guide 🚀

## 🔑 Admin Login

**URL:** http://localhost:5173/admin/login

**Credentials:**
- Email: `admin@solapurcorporation.gov.in`
- Password: `admin123`

⚠️ **Change password after first login!**

---

## 📋 Quick Actions

### 1. Approve New Officers
1. Go to **Pending Approvals** (sidebar)
2. Review officer details
3. Click **Approve** or **Reject**
4. Officer can now login (if approved)

### 2. Manage Departments
1. Go to **Departments** (sidebar)
2. Click **Add Department** to create new
3. Click edit icon to modify
4. Toggle status to activate/deactivate

### 3. View Statistics
1. Go to **Statistics** (sidebar)
2. See department performance
3. Check officer leaderboard
4. View resolution rates

### 4. Manage Officers
1. Go to **Officers** (sidebar)
2. Filter by status/department
3. Search by name/email/phone
4. Revoke or activate access

---

## 🏢 Departments (Pre-configured)

| Department | Complaint Types |
|------------|----------------|
| Sanitation Department | Garbage |
| Roads & Infrastructure | Road Damage |
| Water Supply | Water Leakage |
| Electrical | Street Light |
| Drainage & Sewerage | Drainage |

---

## 👮 Officer Approval Process

**Step 1:** Officer registers with email + department  
**Step 2:** Status = "Pending Approval"  
**Step 3:** Admin approves/rejects  
**Step 4:** Officer can login (if approved)  
**Step 5:** Officer sees only their department's complaints  

---

## 📊 Dashboard Metrics

- **Total Complaints** - All complaints in system
- **Pending Complaints** - Awaiting action
- **Resolved Complaints** - Successfully closed
- **Active Officers** - Currently working
- **Total Citizens** - Registered users
- **Departments** - Active departments

---

## 🔍 Search & Filter

### Officers Page
- **Status:** All, Active, Pending, Inactive, Rejected
- **Department:** Filter by specific department
- **Search:** Name, email, or phone number

### Statistics Page
- **Date Range:** Last 7 days, 30 days, 3 months, All time
- **Department:** View specific department stats
- **Officer:** View individual officer performance

---

## ⚡ Keyboard Shortcuts

- `Ctrl + /` - Search
- `Esc` - Close modal
- `Enter` - Submit form

---

## 🎯 Common Tasks

### Create New Department
1. Departments → Add Department
2. Enter name, description
3. Add complaint types (comma-separated)
4. Click Create

### Approve Officer
1. Pending Approvals
2. Review details
3. Click Approve
4. Done!

### Revoke Officer Access
1. Officers → Find officer
2. Click "Revoke Access"
3. Confirm action

### View Department Performance
1. Statistics
2. Find department in table
3. See metrics (total, pending, resolved, rate)

---

## 🚨 Important Notes

- Officers MUST be approved before they can login
- Complaints are AUTO-ASSIGNED to departments
- Officers see ONLY their department's complaints
- Deactivating a department requires no active officers
- All actions are logged for audit

---

## 📱 Mobile Access

Admin portal is fully responsive:
- ✅ Mobile phones
- ✅ Tablets
- ✅ Desktop

---

## 🆘 Troubleshooting

**Can't login?**
- Check email and password
- Ensure admin account is active
- Clear browser cache

**Pending approvals not showing?**
- Refresh page
- Check if officers registered with email

**Statistics not loading?**
- Check backend server is running
- Verify database connection
- Check browser console for errors

---

## 📞 Support

**Helpline:** 0217-2735293, 0217-2740335  
**Email:** smcwebsite.feedback@gmail.com

---

## 🔗 Quick Links

| Portal | URL |
|--------|-----|
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Departments | http://localhost:5173/admin/departments |
| Officers | http://localhost:5173/admin/officers |
| Pending Approvals | http://localhost:5173/admin/officers/pending |
| Statistics | http://localhost:5173/admin/statistics |

---

**Last Updated:** February 8, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
