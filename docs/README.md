# Solapur Municipal Corporation - Citizen Complaint Portal Documentation

## 📚 Complete Documentation Index

Welcome to the SMC Citizen Complaint Portal documentation. All project documentation is organized here.

---

## 🚀 Quick Start Guides

### For Developers
- **[Quick Reference](QUICK_REFERENCE.md)** - Quick commands and setup
- **[URLs Reference](URLS.md)** - All frontend and backend URLs
- **[Admin Quick Start](ADMIN_QUICK_START.md)** - Admin portal setup
- **[Final Setup Instructions](FINAL_SETUP_INSTRUCTIONS.md)** - Complete setup guide

### For Users
- **[Officer Registration Guide](OFFICER_REGISTRATION_GUIDE.md)** - How officers register
- **[System Workflow](SYSTEM_WORKFLOW.md)** - How the system works

---

## 📖 Project Overview

### Main Documentation
- **[Project Documentation](PROJECT_DOCUMENTATION.md)** - Complete project overview
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - What has been built
- **[Documentation Organization](DOCUMENTATION_ORGANIZATION.md)** - How docs are structured

---

## 🏗️ Implementation Guides

### Admin Portal
- **[Admin Portal Complete Summary](ADMIN_PORTAL_COMPLETE_SUMMARY.md)** - Full admin features
- **[Admin Portal Backend](ADMIN_PORTAL_BACKEND_COMPLETE.md)** - Backend API documentation
- **[Admin Portal Frontend](ADMIN_PORTAL_FRONTEND_PHASE1_COMPLETE.md)** - Frontend implementation
- **[Admin Portal Implementation Plan](ADMIN_PORTAL_IMPLEMENTATION_PLAN.md)** - Original plan

### Collections & Database
- **[Separate Collections Complete](SEPARATE_COLLECTIONS_COMPLETE.md)** - Citizens, Officers, Admins separation

---

## 🔧 Troubleshooting & Fixes

### Admin Portal Issues
- **[Admin Portal Debug Guide](ADMIN_PORTAL_DEBUG_GUIDE.md)** - Debugging admin issues
- **[Admin Portal Fix Summary](ADMIN_PORTAL_FIX_SUMMARY.md)** - Recent fixes
- **[What Was Fixed](WHAT_WAS_FIXED.md)** - Detailed fix documentation

### Citizen Portal Issues
- **[Citizen Login Troubleshooting](CITIZEN_LOGIN_TROUBLESHOOTING.md)** - Login/register issues

### Specific Fixes
- **[Department Dropdown Fix](DEPARTMENT_DROPDOWN_FIX.md)** - Officer registration dropdown
- **[Troubleshooting](TROUBLESHOOTING.md)** - General troubleshooting

---

## 🎨 UI & Assets

- **[How to Add Images](HOW_TO_ADD_IMAGES.md)** - Adding images to project
- **[Image Placement Instructions](IMAGE_PLACEMENT_INSTRUCTIONS.md)** - Where to place images
- **[README Images](README_IMAGES.md)** - Images for documentation

---

## 🤖 AI Features

- **[AI Analysis Guide](AI_ANALYSIS_GUIDE.md)** - AI-powered complaint analysis

---

## 📋 Project Structure

```
SMC-Citizen-Complaint-Portal/
├── Citizen-backend/          # Backend API (Node.js + Express)
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & upload middleware
│   ├── services/            # AI & department services
│   └── scripts/             # Database seed scripts
│
├── citizen-frontend-react/   # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth & admin context
│   │   └── services/        # API services
│   └── public/              # Static assets
│
└── docs/                     # All documentation (this folder)
```

---

## 🎯 Key Features

### For Citizens
- ✅ Register and login with phone number
- ✅ Submit complaints with images
- ✅ Track complaint status
- ✅ View complaint history
- ✅ AI-powered complaint analysis

### For Officers
- ✅ Register with email and department
- ✅ Require admin approval
- ✅ View assigned complaints
- ✅ Update complaint status
- ✅ Resolve complaints

### For Admins
- ✅ Approve/reject officer registrations
- ✅ Manage departments
- ✅ View statistics and analytics
- ✅ Manage all officers
- ✅ Monitor system performance

---

## 🔐 Default Credentials

### Admin Account
```
Email: admin@solapurcorporation.gov.in
Password: admin123
```

### Test Citizen (if created)
```
Phone: 8888888888
Password: test123
```

---

## 🚀 Quick Commands

### Start Backend
```bash
cd Citizen-backend
node server.js
```

### Start Frontend
```bash
cd citizen-frontend-react
npm run dev
```

### Seed Departments
```bash
cd Citizen-backend
node scripts/seedDepartments.js
```

### Create Admin
```bash
cd Citizen-backend
node scripts/createAdmin.js
```

---

## 📞 Support Information

**Solapur Municipal Corporation**
- Helpline: 0217-2735293, 0217-2740335
- Email: smcwebsite.feedback@gmail.com
- Website: [Solapur Municipal Corporation](https://solapurcorporation.gov.in)

---

## 🔗 Quick Links

- [Main README](../README.md) - Project root README
- [Backend Package](../Citizen-backend/package.json) - Backend dependencies
- [Frontend Package](../citizen-frontend-react/package.json) - Frontend dependencies

---

## 📝 Documentation Updates

This documentation is organized and maintained in the `docs/` folder. All guides, troubleshooting, and implementation details are centralized here for easy access.

**Last Updated:** February 8, 2026

---

## 🎓 Learning Resources

### Technologies Used
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Vite, TailwindCSS, React Router
- **AI:** Google Gemini API
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer

### Key Concepts
- RESTful API design
- JWT authentication
- Role-based access control
- File upload handling
- AI integration
- React context for state management

---

**For detailed information on any topic, refer to the specific documentation file listed above.**
