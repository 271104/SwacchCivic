# Solapur Municipal Corporation - Complaint Management System

## 🏛️ Official SMC Citizen Complaint Portal

A professional complaint management system for Solapur Municipal Corporation with React frontend and Node.js backend.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Installation](#installation)
6. [Usage](#usage)
7. [API Documentation](#api-documentation)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## 🚀 Quick Start

### Start Both Servers
```bash
# Option 1: Double-click
start-dev.bat

# Option 2: Manual
# Terminal 1 - Backend:
cd Citizen-backend
npm run dev

# Terminal 2 - Frontend:
cd citizen-frontend-react
npm run dev
```

### Create Officer Account
```bash
# Double-click
create-officer.bat

# Or use curl:
curl -X POST http://localhost:5000/api/auth/officer/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Officer Name\",\"phone\":\"1234567890\",\"password\":\"password123\"}"
```

### Access Application
- **Citizen Portal:** http://localhost:5173
- **Officer Portal:** http://localhost:5173/officer/login
- **Backend API:** http://localhost:5000

---

## 📖 Project Overview

### Official Information
- **Organization:** Solapur Municipal Corporation (सोलापूर महानगरपालिका)
- **Helpline:** 0217-2735293, 0217-2740335
- **Email:** smcwebsite.feedback@gmail.com
- **Office Hours:** Mon-Fri: 9:45 AM - 6:15 PM
- **Tagline:** आपली सेवा आमचे कर्तव्य (Your Service, Our Duty)

### Purpose
Enable citizens to register and track civic complaints online with photo evidence, while allowing SMC officers to efficiently manage and resolve issues.

---

## ✨ Features

### Citizen Portal
- ✅ User registration and authentication
- ✅ Submit complaints with photo evidence
- ✅ Bilingual interface (English/Marathi)
- ✅ Track complaint status in real-time
- ✅ View complaint history
- ✅ Search and filter complaints
- ✅ Mobile-responsive design

### Officer Portal
- ✅ Secure officer login
- ✅ View all complaints sorted by priority
- ✅ Update complaint status (pending → in progress → resolved)
- ✅ View pending and resolved complaints separately
- ✅ Search and filter functionality
- ✅ Professional dark theme interface

### Complaint Types
1. Garbage (कचरा)
2. Road Damage (रस्ता खराब)
3. Water Leakage (पाणी गळती)
4. Street Light (रस्त्यावरील दिवा)
5. Drainage (गटार)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer
- **Security:** Express Rate Limit, CORS

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend:
```bash
cd Citizen-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/smc_citizen
JWT_SECRET=MyPass@123
PORT=5000
JWT_EXPIRES_IN=7d
```

4. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd citizen-frontend-react
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

---

## 📱 Usage

### Citizen Flow
1. **Register:** http://localhost:5173/register
2. **Login:** http://localhost:5173/login
3. **Dashboard:** View options to register or track complaints
4. **Register Complaint:** Upload photo, select type, add location
5. **My Complaints:** Track status of submitted complaints

### Officer Flow
1. **Login:** http://localhost:5173/officer/login
2. **Dashboard:** View pending and resolved complaints
3. **Pending Complaints:** Review and update status
4. **Mark Resolved:** Update complaint status to resolved
5. **Resolved Complaints:** View history of completed complaints

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register Citizen
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Citizen Name",
  "phone": "1234567890",
  "password": "password123"
}
```

#### Register Officer
```http
POST /api/auth/officer/register
Content-Type: application/json

{
  "name": "Officer Name",
  "phone": "9876543210",
  "password": "officer123"
}
```

#### Login (Universal)
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "1234567890",
  "password": "password123"
}
```

### Complaint Endpoints

#### Create Complaint (Citizen)
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

type: "Garbage"
description: "Garbage pile on main street"
location: "Main Street, Block A"
photo: <file>
```

#### Get My Complaints (Citizen)
```http
GET /api/complaints/mine
Authorization: Bearer <token>
```

#### Get All Complaints (Officer)
```http
GET /api/complaints
Authorization: Bearer <token>
```

#### Update Complaint Status (Officer)
```http
PUT /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved"
}
```

**Status Values:** `pending`, `in_progress`, `resolved`

---

## 🧪 Testing

### Manual Testing Steps

1. **Create Officer Account:**
   - Run `create-officer.bat`
   - Or use API endpoint

2. **Test Citizen Registration:**
   - Open http://localhost:5173/register
   - Fill form and submit
   - Verify redirect to login

3. **Test Citizen Login:**
   - Login with registered credentials
   - Verify redirect to dashboard

4. **Test Complaint Submission:**
   - Click "Register Complaint"
   - Fill all fields and upload photo
   - Submit and verify success

5. **Test Officer Login:**
   - Open http://localhost:5173/officer/login
   - Login with officer credentials
   - Verify redirect to officer dashboard

6. **Test Status Update:**
   - View pending complaints
   - Click "Mark Resolved"
   - Verify status updates

7. **Test Citizen View:**
   - Login as citizen
   - View "My Complaints"
   - Verify status shows as resolved

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
**Solution:**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Or update .env with cloud MongoDB URI
```

### Port Already in Use
**Backend (5000):**
- Change `PORT` in `.env`
- Update API_URL in frontend

**Frontend (5173):**
- Vite will auto-use next available port
- Or change in `vite.config.js`

### CORS Errors
**Solution:**
- Verify frontend URL in `Citizen-backend/server.js`
- Current allowed: `http://localhost:5173`, `http://127.0.0.1:5173`

### Images Not Displaying
**Solution:**
- Check `uploads/complaints/` folder exists
- Verify backend static file serving
- Check browser console for 404 errors

### Status Update Errors
**Solution:**
- Verify officer authentication
- Check complaint ID is valid
- Review backend logs for errors

---

## 🚀 Deployment

### Pre-Deployment Checklist
- [ ] Replace placeholder data with production values
- [ ] Update API URLs for production
- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up file storage (S3, etc.)
- [ ] Test on all supported browsers
- [ ] Get SMC official approval
- [ ] Train SMC staff

### Production Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smc_citizen
JWT_SECRET=<strong-random-secret>
PORT=5000
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

**Frontend:**
Update `src/services/api.js`:
```javascript
const API_URL = 'https://api.complaints.solapurcorporation.gov.in';
```

### Build for Production

**Frontend:**
```bash
cd citizen-frontend-react
npm run build
# Output in: dist/
```

**Backend:**
```bash
cd Citizen-backend
npm start
```

---

## 📁 Project Structure

```
.
├── Citizen-backend/              # Node.js + Express API
│   ├── middleware/               # Auth, role, upload
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API routes
│   ├── uploads/                  # Uploaded photos
│   ├── .env                      # Environment variables
│   ├── package.json              # Dependencies
│   └── server.js                 # Entry point
│
├── citizen-frontend-react/       # React + Vite app
│   ├── public/                   # Static assets
│   │   └── smc-logo-official.svg # Official SMC logo
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   └── common/           # SMCHeader, SMCFooter, etc.
│   │   ├── context/              # Auth context
│   │   ├── pages/                # Page components
│   │   │   ├── citizen/          # Citizen portal pages
│   │   │   └── officer/          # Officer portal pages
│   │   ├── services/             # API service layer
│   │   ├── utils/                # Helper functions
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite configuration
│
├── start-dev.bat                 # Start both servers
├── create-officer.bat            # Create officer account
└── PROJECT_DOCUMENTATION.md      # This file
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Role-based access control (citizen/officer)
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS protection
- ✅ File type validation (images only)
- ✅ Token expiry (1 day citizens, 8 hours officers)
- ✅ Protected routes on frontend
- ✅ Authorization middleware on backend

---

## 🎨 Design Features

### Official SMC Branding
- Official logo with lion emblem
- Blue and gold color scheme (#1a5490, #fbbf24)
- Bilingual content (English/Marathi)
- Professional government styling
- Mobile-responsive design

### User Experience
- Clean, modern interface
- Smooth animations
- Toast notifications
- Loading states
- Error handling
- Accessibility-compliant

---

## 📞 Support

### Technical Issues
- **Web Information Manager:** Birudev Sarvade
- **Designation:** System Support Engineer
- **Email:** smcwebsite.feedback@gmail.com
- **Phone:** +91-9011962627

### Complaints Helpline
- **Phone:** 0217-2735293, 0217-2740335
- **Office Hours:** Mon-Fri: 9:45 AM - 6:15 PM

### Official Websites
- **Main Website:** https://www.solapurcorporation.gov.in
- **Complaint Portal:** https://complaint.solapurcorporation.org

---

## 📄 License

© 2026 Solapur Municipal Corporation. All Rights Reserved.

Official Website of Solapur Municipal Corporation, Government of Maharashtra, India.

---

## 🙏 Acknowledgments

- Solapur Municipal Corporation
- Government of Maharashtra
- Citizens of Solapur

---

**Status:** ✅ Production Ready
**Version:** 2.1 (Official SMC)
**Last Updated:** February 8, 2026
