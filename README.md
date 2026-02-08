# 🏛️ Solapur Municipal Corporation - Citizen Complaint Portal

A comprehensive web-based complaint management system for Solapur Municipal Corporation, enabling citizens to register and track complaints while allowing officers and administrators to manage and resolve them efficiently.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SMC-Citizen-Complaint-Portal
   ```

2. **Setup Backend**
   ```bash
   cd Citizen-backend
   npm install
   cp .env.example .env  # Configure your environment variables
   node scripts/seedDepartments.js  # Seed departments
   node scripts/createAdmin.js      # Create admin account
   node server.js                   # Start backend
   ```

3. **Setup Frontend**
   ```bash
   cd citizen-frontend-react
   npm install
   npm run dev  # Start frontend
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Portal: http://localhost:5173/admin/login

---

## 🎯 Features

### 👥 For Citizens
- Register and login with phone number
- Submit complaints with images
- Track complaint status in real-time
- View complaint history
- AI-powered complaint categorization

### 👮 For Officers
- Register with email and department
- View assigned complaints
- Update complaint status
- Resolve complaints
- Department-specific complaint management

### 🔐 For Administrators
- Approve/reject officer registrations
- Manage departments and complaint types
- View system statistics and analytics
- Monitor officer performance
- Manage all users and complaints

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **AI:** Google Gemini API

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **State Management:** React Context
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

---

## 📁 Project Structure

```
SMC-Citizen-Complaint-Portal/
├── Citizen-backend/              # Backend API
│   ├── config/                   # Configuration files
│   ├── middleware/               # Auth & upload middleware
│   ├── models/                   # MongoDB models
│   ├── routes/                   # API routes
│   ├── scripts/                  # Database seed scripts
│   ├── services/                 # Business logic
│   ├── uploads/                  # Uploaded files
│   └── server.js                 # Entry point
│
├── citizen-frontend-react/       # Frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── context/              # React context
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   └── utils/                # Helper functions
│   └── index.html                # HTML template
│
├── docs/                         # Complete documentation
└── README.md                     # This file
```

---

## 🔐 Default Credentials

### Admin Account
```
Email: admin@solapurcorporation.gov.in
Password: admin123
```

**⚠️ Important:** Change the default admin password after first login in production!

---

## 📚 Documentation

Complete documentation is available in the [`docs/`](docs/) folder:

- **[Complete Documentation Index](docs/README.md)** - All documentation
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Quick commands
- **[Admin Quick Start](docs/ADMIN_QUICK_START.md)** - Admin setup
- **[System Workflow](docs/SYSTEM_WORKFLOW.md)** - How it works
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - What's built

---

## 🌟 Key Highlights

### AI-Powered Analysis
- Automatic complaint categorization using Google Gemini AI
- Priority calculation based on complaint severity
- Smart department assignment

### Role-Based Access Control
- Three distinct user roles: Citizens, Officers, Admins
- Separate collections for better data management
- Secure authentication with JWT

### Real-Time Updates
- Live complaint status tracking
- Instant notifications
- Dashboard analytics

### Mobile-Friendly
- Responsive design
- Works on all devices
- Touch-optimized interface

---

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in `Citizen-backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smc_db
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend Configuration
API URL is configured in `citizen-frontend-react/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/register` - Citizen registration
- `POST /api/auth/login` - Citizen login
- `POST /api/auth/officer/register` - Officer registration
- `POST /api/auth/officer/login` - Officer login
- `POST /api/admin/login` - Admin login

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/mine` - Get user's complaints
- `GET /api/complaints` - Get all complaints (officers)
- `PUT /api/complaints/:id/status` - Update status

### Admin
- `GET /api/admin/officers/pending` - Pending officers
- `PUT /api/admin/officers/:id/approve` - Approve officer
- `GET /api/admin/departments` - Get departments
- `GET /api/admin/stats/overview` - System statistics

For complete API documentation, see [Admin Portal Backend](docs/ADMIN_PORTAL_BACKEND_COMPLETE.md).

---

## 🧪 Testing

### Test Backend
```bash
cd Citizen-backend
npm test  # If tests are configured
```

### Manual Testing
1. Register as citizen
2. Submit a complaint
3. Register as officer (requires admin approval)
4. Login as admin and approve officer
5. Login as officer and resolve complaint

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and is configured
- Check port 5000 is not in use

### Frontend won't start
- Run `npm install` in frontend folder
- Check port 5173 is not in use
- Clear node_modules and reinstall if needed

### Login issues
- Clear browser localStorage
- Check backend is running
- Verify credentials are correct

For detailed troubleshooting, see [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

---

## 📞 Support

**Solapur Municipal Corporation**
- **Helpline:** 0217-2735293, 0217-2740335
- **Email:** smcwebsite.feedback@gmail.com
- **Website:** [solapurcorporation.gov.in](https://solapurcorporation.gov.in)

---

## 📝 License

This project is developed for Solapur Municipal Corporation.

---

## 🙏 Acknowledgments

- Solapur Municipal Corporation
- Google Gemini AI for complaint analysis
- Open source community for the amazing tools and libraries

---

## 📅 Version History

- **v1.0.0** - Initial release with complete citizen, officer, and admin portals
- **v1.1.0** - Added AI-powered complaint analysis
- **v1.2.0** - Separated user collections for better data management

---

**For complete documentation, visit the [`docs/`](docs/) folder.**
