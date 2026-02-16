# SwacchCivic - Smart Civic Complaint Management System

A modern web-based complaint management system for Solapur Municipal Corporation that enables citizens to register civic complaints using AI-powered geotagged camera technology.

---

## 🎯 Overview

SwacchCivic is a comprehensive platform that connects citizens, municipal officers, and administrators to efficiently manage and resolve civic complaints. The system uses AI to automatically detect complaint types, analyze severity, and route complaints to the appropriate departments.

---

## ✨ Key Features

### 📸 AI-Powered Geotagged Camera
- **Automatic Camera Launch**: Camera opens immediately when registering a complaint
- **GPS Location Tagging**: Captures precise GPS coordinates with every photo
- **Real-time Location Display**: Shows address, coordinates, and timestamp on camera
- **AI Type Detection**: Automatically identifies complaint type from the image
- **AI Severity Analysis**: Analyzes severity, priority, and estimated resolution time

### 👥 Three User Roles

#### Citizens
- Register complaints with geotagged photos
- Track complaint status in real-time
- View complaint history
- Receive AI-powered insights

#### Officers
- View assigned complaints by department
- Update complaint status (pending → in progress → resolved)
- Access detailed complaint information with GPS location
- Manage workload efficiently

#### Administrators
- Approve/reject officer registrations
- Manage departments and officers
- View system-wide statistics and analytics
- Monitor complaint resolution performance

---

## 🤖 AI Features

### Automatic Complaint Type Detection
AI analyzes the captured image and automatically detects:
- **Garbage Collection** - Waste accumulation, overflowing bins
- **Road Damage** - Potholes, cracks, damaged pavement
- **Water Leakage** - Pipe bursts, water wastage
- **Street Light** - Non-functioning lights, dark streets
- **Drainage** - Blocked drains, water logging

### Intelligent Analysis
- **Severity Assessment**: 0-100% severity score
- **Priority Calculation**: Low, Medium, High, Critical
- **Issue Detection**: Identifies specific problems in the image
- **Resolution Estimation**: Predicts resolution timeframe
- **Department Routing**: Auto-assigns to correct department

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Google Gemini AI** - Image analysis

### APIs Used
- **Google Gemini Pro** - AI image analysis and type detection
- **OpenStreetMap Nominatim** - Reverse geocoding (GPS to address)
- **Browser Geolocation API** - GPS coordinates
- **Browser MediaDevices API** - Camera access

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Gemini API Key
- Modern web browser with camera support

---

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/271104/SwacchCivic.git
cd SwacchCivic
```

### 2. Backend Setup
```bash
cd Citizen-backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/citizen-complaint
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Seed database:
```bash
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

Start backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd citizen-frontend-react
npm install
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 👤 Default Credentials

### Admin Account
```
Email: admin@solapurcorporation.gov.in
Password: admin123
```

### Test Citizen
Register a new citizen account at `/register`

### Test Officer
1. Register at `/officer/register`
2. Wait for admin approval
3. Login at `/officer/login`

---

## 📱 Mobile Testing

To test the camera feature on your phone:

1. **Get your laptop's IP address**:
   ```bash
   ipconfig
   ```

2. **Update API URLs** in:
   - `citizen-frontend-react/src/services/api.js`
   - `citizen-frontend-react/src/services/adminAPI.js`
   
   Change `localhost` to your IP (e.g., `192.168.1.5`)

3. **Start servers with network access**:
   ```bash
   # Backend
   cd Citizen-backend
   node server.js
   
   # Frontend (network mode)
   cd citizen-frontend-react
   npm run dev -- --host
   ```

4. **Access from phone**: `http://YOUR_IP:5173/`

---

## 🎯 How It Works

### Citizen Flow
1. **Login/Register** → Citizen creates account
2. **Click "Register Complaint"** → Camera opens automatically
3. **Capture Photo** → GPS location tagged automatically
4. **Add Description** (optional) → Helps AI analyze better
5. **Submit** → AI analyzes and detects complaint type
6. **View Results** → See detected type, severity, priority, and estimated resolution

### AI Processing
1. **Detect Type** → AI identifies complaint category from image
2. **Analyze Severity** → Calculates 0-100% severity score
3. **Calculate Priority** → Determines urgency level
4. **Assign Department** → Routes to correct department
5. **Estimate Resolution** → Predicts resolution timeframe

### Officer Flow
1. **Login** → Access officer dashboard
2. **View Complaints** → See complaints assigned to their department
3. **Update Status** → Mark as in progress or resolved
4. **Track Progress** → Monitor resolution metrics

### Admin Flow
1. **Login** → Access admin dashboard
2. **Approve Officers** → Review and approve officer registrations
3. **Manage Departments** → Create and manage departments
4. **View Statistics** → Monitor system performance

---

## 📊 Complaint Types

| Type | Description | Examples |
|------|-------------|----------|
| **Garbage Collection** | Waste management issues | Overflowing bins, garbage piles, litter |
| **Road Damage** | Road infrastructure problems | Potholes, cracks, damaged pavement |
| **Water Leakage** | Water supply issues | Pipe bursts, leaks, water wastage |
| **Street Light** | Public lighting problems | Non-functioning lights, dark streets |
| **Drainage** | Sewage and drainage issues | Blocked drains, overflowing sewers |

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Separate permissions for each role
- **Password Hashing** - bcrypt encryption
- **Protected Routes** - Middleware-based route protection
- **CORS Configuration** - Controlled API access

---

## 📞 Contact & Support

**Solapur Municipal Corporation**
- **Helpline**: 0217-2735293, 0217-2740335
- **Email**: smcwebsite.feedback@gmail.com
- **Website**: https://solapurcorporation.gov.in

**GitHub Repository**: https://github.com/271104/SwacchCivic

---

## 🌟 Key Highlights

✅ **Zero Manual Input** - AI detects complaint type automatically  
✅ **GPS Verified** - Every complaint has precise location proof  
✅ **Real-time Tracking** - Citizens can track complaint status  
✅ **Smart Routing** - Complaints auto-assigned to correct department  
✅ **AI-Powered** - Intelligent severity and priority analysis  
✅ **Mobile-First** - Optimized for mobile camera usage  
✅ **Bilingual** - English and Marathi support  

---

## 📄 License

This project is developed for Solapur Municipal Corporation.

---

## 🙏 Acknowledgments

- Solapur Municipal Corporation
- Google Gemini AI
- OpenStreetMap Nominatim
- React and Node.js communities

---

**Built with ❤️ for Solapur Municipal Corporation**
