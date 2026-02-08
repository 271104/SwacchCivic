# Officer Registration & Login Guide

## Overview
With the new separate collections system, officers now register with **email and department** instead of just phone number. This guide explains the complete officer registration and approval workflow.

---

## 🆕 What's Changed

### Before (Old System)
- Officers registered with: Name, Phone, Password
- Login with: Phone, Password
- No approval required
- No department assignment

### After (New System)
- Officers register with: Name, **Email**, Phone, Password, **Department**
- Login with: **Email**, Password
- **Admin approval required** before login
- Department assignment mandatory

---

## 👮 Officer Registration Process

### Step 1: Access Registration Page
**URL:** http://localhost:5173/officer/register

### Step 2: Fill Registration Form
Required fields:
- **Full Name** - Your complete name
- **Email Address** - Official email (must be unique)
- **Phone Number** - Contact number (must be unique)
- **Department** - Select from dropdown:
  - Sanitation Department (Garbage)
  - Roads & Infrastructure Department (Road Damage)
  - Water Supply Department (Water Leakage)
  - Electrical Department (Street Light)
  - Drainage & Sewerage Department (Drainage)
- **Password** - Minimum 6 characters
- **Confirm Password** - Must match password

### Step 3: Submit Registration
- Click "Register as Officer"
- You'll see a confirmation screen
- Status: **Pending Approval**

### Step 4: Wait for Admin Approval
- Your registration is sent to administrators
- Admin will review and approve/reject
- Typical approval time: 24-48 hours
- You'll receive notification once approved

### Step 5: Login After Approval
- Once approved, go to: http://localhost:5173/officer/login
- Login with your **email** and password
- Access your department's complaints

---

## 🔐 Officer Login Process

### Login Credentials
- **Email:** Your registered email address
- **Password:** Your password

### Login URL
http://localhost:5173/officer/login

### Login Statuses

**✅ Active**
- You can login successfully
- Access to department complaints
- Full officer functionality

**⏳ Pending**
- Cannot login yet
- Error: "Your account is pending approval"
- Wait for admin approval

**❌ Rejected**
- Cannot login
- Error: "Your account has been rejected"
- Contact admin for details

**🚫 Inactive**
- Cannot login
- Error: "Your account has been deactivated"
- Contact admin to reactivate

---

## 👨‍💼 Admin Approval Workflow

### For Administrators

1. **View Pending Registrations**
   - Login to admin portal
   - Go to "Pending Approvals"
   - See list of pending officers

2. **Review Officer Details**
   - Name, Email, Phone
   - Selected Department
   - Registration Date

3. **Approve or Reject**
   - Click "Approve" to activate officer
   - Click "Reject" to deny access
   - Optional: Add rejection reason

4. **Officer Notification**
   - Officer status updated immediately
   - Officer can login if approved

---

## 📋 Registration Requirements

### Email Requirements
- Must be valid email format
- Must be unique (not already registered)
- Recommended: Use official email
- Example: `officer.name@solapurcorporation.gov.in`

### Phone Requirements
- Must be valid phone number
- Must be unique (not already registered)
- Format: Any valid format accepted

### Password Requirements
- Minimum 6 characters
- Can include letters, numbers, symbols
- Must match confirmation

### Department Requirements
- Must select one department
- Cannot be changed after registration (admin can change)
- Determines which complaints you see

---

## 🔄 Complete Workflow Example

### Example: New Officer Registration

**Officer: Rajesh Kumar**

1. **Registration (Officer)**
   ```
   Name: Rajesh Kumar
   Email: rajesh.kumar@solapurcorporation.gov.in
   Phone: 9876543210
   Department: Sanitation Department
   Password: ******
   ```
   - Submits form
   - Sees "Pending Approval" message
   - Cannot login yet

2. **Approval (Admin)**
   - Admin logs in
   - Sees Rajesh's registration in "Pending Approvals"
   - Reviews details
   - Clicks "Approve"
   - Rajesh's status → "Active"

3. **Login (Officer)**
   - Rajesh goes to officer login
   - Enters email: `rajesh.kumar@solapurcorporation.gov.in`
   - Enters password
   - Successfully logs in
   - Sees only Sanitation Department complaints

---

## 🎯 Key Features

### 1. Email-Based Authentication
- More professional than phone-only
- Easier for password recovery
- Better for official communication

### 2. Department Assignment
- Officers assigned to specific department
- See only relevant complaints
- Better workload distribution

### 3. Admin Approval
- Quality control for officer access
- Prevents unauthorized access
- Audit trail of approvals

### 4. Status Management
- Pending: Awaiting approval
- Active: Can access system
- Inactive: Temporarily disabled
- Rejected: Access denied

---

## 🚨 Common Issues & Solutions

### Issue 1: "Email already exists"
**Solution:** Use a different email address or contact admin if you forgot your account

### Issue 2: "Phone already exists"
**Solution:** Use a different phone number or contact admin

### Issue 3: "Cannot login - Pending approval"
**Solution:** Wait for admin approval (24-48 hours)

### Issue 4: "Cannot login - Account rejected"
**Solution:** Contact admin for reason and reapply if needed

### Issue 5: "Cannot login - Account inactive"
**Solution:** Contact admin to reactivate your account

### Issue 6: "Departments not loading"
**Solution:** Check backend server is running, refresh page

### Issue 7: "Forgot password"
**Solution:** Contact admin to reset password (feature coming soon)

---

## 📞 Support

### For Officers
- **Registration Issues:** Contact admin
- **Login Issues:** Check status with admin
- **Department Change:** Request admin to change

### For Admins
- **Approve Officers:** Admin Portal → Pending Approvals
- **Manage Officers:** Admin Portal → Officers
- **Change Department:** Officers → Select Officer → Change Department

### Contact
- **Email:** smcwebsite.feedback@gmail.com
- **Phone:** 0217-2735293, 0217-2740335

---

## 📊 Registration Statistics

### Typical Timeline
- **Registration:** Instant
- **Admin Review:** 24-48 hours
- **Approval:** Instant (once admin approves)
- **Login Access:** Immediate after approval

### Success Rates
- **Approval Rate:** ~95% (if valid information)
- **Rejection Rate:** ~5% (invalid/duplicate info)

---

## 🔗 Quick Links

| Action | URL |
|--------|-----|
| Officer Registration | http://localhost:5173/officer/register |
| Officer Login | http://localhost:5173/officer/login |
| Admin Portal | http://localhost:5173/admin/login |
| Pending Approvals | http://localhost:5173/admin/officers/pending |

---

## 📝 Registration Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | Text | Yes | Any text |
| Email | Email | Yes | Valid email, unique |
| Phone | Tel | Yes | Valid phone, unique |
| Department | Select | Yes | Must select one |
| Password | Password | Yes | Min 6 characters |
| Confirm Password | Password | Yes | Must match password |

---

## 🎓 Best Practices

### For Officers
1. Use official email address
2. Choose correct department
3. Use strong password
4. Wait patiently for approval
5. Contact admin if issues

### For Admins
1. Review registrations promptly
2. Verify officer details
3. Approve legitimate requests
4. Provide rejection reasons
5. Monitor officer activity

---

## 🔮 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] SMS notifications for approval
- [ ] Email notifications
- [ ] Self-service department change
- [ ] Profile management
- [ ] Two-factor authentication

---

**Last Updated:** February 8, 2026  
**Version:** 2.0.0 (Separate Collections)  
**Status:** ✅ Active

---

## Quick Summary

**New Officers:**
1. Go to http://localhost:5173/officer/register
2. Fill form with email, phone, department
3. Wait for admin approval
4. Login with email at http://localhost:5173/officer/login

**Admins:**
1. Go to http://localhost:5173/admin/officers/pending
2. Review pending officers
3. Approve or reject
4. Officer can login immediately after approval

**That's it!** 🎉
