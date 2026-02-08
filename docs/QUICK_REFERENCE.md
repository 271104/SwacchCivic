# SMC Complaint Management System - Quick Reference

## 🌐 Application URLs (Development)

### Citizen Portal
| Page | URL |
|------|-----|
| Login | http://localhost:5173/login |
| Register | http://localhost:5173/register |
| Dashboard | http://localhost:5173/dashboard |
| Register Complaint | http://localhost:5173/register-complaint |
| My Complaints | http://localhost:5173/my-complaints |

### Officer Portal
| Page | URL |
|------|-----|
| Officer Login | http://localhost:5173/officer/login |
| Officer Dashboard | http://localhost:5173/officer/dashboard |
| Pending Complaints | http://localhost:5173/officer/pending |
| Resolved Complaints | http://localhost:5173/officer/resolved |

### Backend API
| Service | URL |
|---------|-----|
| Base URL | http://localhost:5000 |
| Auth API | http://localhost:5000/api/auth |
| Complaints API | http://localhost:5000/api/complaints |

---

## 🔑 Test Accounts

### Create Officer Account
Run: `create-officer.bat`

Or manually:
```bash
curl -X POST http://localhost:5000/api/auth/officer/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Officer Name\",\"phone\":\"1234567890\",\"password\":\"password123\"}"
```

### Citizen Account
Register at: http://localhost:5173/register

---

## 🚀 Quick Start Commands

### Start Both Servers
```bash
start-dev.bat
```

Or manually:
```bash
# Terminal 1 - Backend
cd Citizen-backend
npm start

# Terminal 2 - Frontend
cd citizen-frontend-react
npm run dev
```

### Create Officer
```bash
create-officer.bat
```

---

## 📋 API Endpoints Reference

### Authentication Endpoints

#### Register Citizen
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Citizen Name",
  "phone": "9876543210",
  "password": "password123"
}
```

#### Register Officer (Dev Only)
```
POST http://localhost:5000/api/auth/officer/register
Content-Type: application/json

{
  "name": "Officer Name",
  "phone": "1234567890",
  "password": "password123"
}
```

#### Login (Citizen or Officer)
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "phone": "9876543210",
  "password": "password123"
}
```

### Complaint Endpoints

#### Create Complaint (Citizen)
```
POST http://localhost:5000/api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "type": "Road Damage",
  "description": "Large pothole",
  "location": "MG Road, Solapur",
  "latitude": "17.6599",
  "longitude": "75.9064",
  "autoDetectedLocation": "MG Road, Solapur, Maharashtra",
  "photo": <file>
}
```

#### Get My Complaints (Citizen)
```
GET http://localhost:5000/api/complaints/mine
Authorization: Bearer <token>
```

#### Get All Complaints (Officer)
```
GET http://localhost:5000/api/complaints
Authorization: Bearer <token>
```

#### Update Complaint Status (Officer)
```
PUT http://localhost:5000/api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress"  // or "pending", "resolved"
}
```

---

## 🎯 Complaint Types

1. **Garbage** - Waste management issues
2. **Road Damage** - Potholes, cracks, road repairs
3. **Water Leakage** - Water supply issues, pipe leaks
4. **Street Light** - Non-functional street lights
5. **Drainage** - Blocked drains, sewerage issues

---

## 📊 Status Values

- **pending** - Newly submitted, awaiting action
- **in_progress** - Officer has started working on it
- **resolved** - Issue has been fixed

---

## 🎨 Priority Levels

- **Critical** (Score: 100) - Red badge
- **High** (Score: 75) - Orange badge
- **Medium** (Score: 50) - Yellow badge
- **Low** (Score: 25) - Green badge

---

## 📞 Contact Information

**Helpline:** 0217-2735293, 0217-2740335  
**Email:** smcwebsite.feedback@gmail.com  
**Office Hours:** Monday-Friday, 9:45 AM - 6:15 PM  
**Website:** https://www.solapurcorporation.gov.in

---

## 🔧 Troubleshooting

### Frontend not loading?
- Check if Vite dev server is running on port 5173
- Run: `cd citizen-frontend-react && npm run dev`

### Backend not responding?
- Check if Express server is running on port 5000
- Run: `cd Citizen-backend && npm start`

### MongoDB connection error?
- Ensure MongoDB is running
- Check connection string in `.env` file

### CORS errors?
- Backend CORS is configured for http://localhost:5173
- Check `Citizen-backend/server.js` CORS settings

### Can't login as officer?
- Create officer account first using `create-officer.bat`
- Or use POST /api/auth/officer/register endpoint

---

## 📁 Project Structure

```
├── Citizen-backend/          # Node.js Express backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth, role, upload middleware
│   ├── services/            # AI analysis service
│   ├── utils/               # Priority calculator
│   └── uploads/             # Uploaded complaint photos
│
├── citizen-frontend-react/   # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth context
│   │   ├── services/        # API service
│   │   └── utils/           # Helper functions
│   └── public/              # Static assets (logos, banners)
│
├── .kiro/specs/             # Feature specifications
├── start-dev.bat            # Start both servers
├── create-officer.bat       # Create officer account
└── README.md                # Main documentation
```

---

## 🎓 User Guides

### For Citizens
1. Register at http://localhost:5173/register
2. Login at http://localhost:5173/login
3. Submit complaint with photo and location
4. Track status in "My Complaints"

### For Officers
1. Get officer account (use create-officer.bat)
2. Login at http://localhost:5173/officer/login
3. View pending complaints (sorted by priority)
4. Update status: Start Work → Mark Resolved
5. View resolved complaints history

---

**Last Updated:** February 8, 2026  
**Version:** 1.0 with Geo-Tagging Feature
