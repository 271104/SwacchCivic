# Troubleshooting Guide - SMC Complaint Management System

## Common Errors and Solutions

### 🔴 403 Forbidden Error

**Error Message:**
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
/api/complaints/mine
/api/complaints
```

**Cause:** You're not logged in or your session has expired.

**Solution:**
1. Make sure you're logged in:
   - Citizens: http://localhost:5173/login
   - Officers: http://localhost:5173/officer/login

2. If already logged in, try logging out and back in:
   - Click logout button
   - Clear browser cache (Ctrl+Shift+Delete)
   - Login again

3. Check browser console for token:
   ```javascript
   // Open browser console (F12) and type:
   localStorage.getItem('token')
   // Should return a JWT token string
   ```

4. If no token, you need to login again

---

### 🔴 Geolocation Error

**Error Message:**
```
Geolocation error: GeolocationPositionError
```

**Cause:** Browser location permission denied or unavailable.

**Solution:**

**Option 1: Grant Location Permission**
1. Click the location icon in browser address bar
2. Select "Allow" for location access
3. Refresh the page
4. Click "Detect Location" button again

**Option 2: Manual Entry**
- Simply type your location in the location field
- The system works fine without GPS coordinates

**Browser-Specific Instructions:**

**Chrome:**
1. Click the lock icon in address bar
2. Click "Site settings"
3. Find "Location" and set to "Allow"
4. Refresh page

**Firefox:**
1. Click the lock icon in address bar
2. Click "Connection secure" → "More information"
3. Go to "Permissions" tab
4. Uncheck "Use default" for Location
5. Check "Allow"
6. Refresh page

**Edge:**
1. Click the lock icon in address bar
2. Click "Permissions for this site"
3. Set Location to "Allow"
4. Refresh page

---

### ⚠️ React Router Warnings

**Warning Message:**
```
React Router Future Flag Warning: v7_startTransition
React Router Future Flag Warning: v7_relativeSplatPath
```

**Cause:** React Router v6 deprecation warnings for v7 changes.

**Status:** ✅ FIXED - Future flags added to suppress warnings.

**If warnings persist:**
These are just warnings and don't affect functionality. They can be safely ignored.

---

### 🔴 401 Unauthorized Error

**Error Message:**
```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
```

**Cause:** Invalid or expired authentication token.

**Solution:**
1. Logout and login again
2. Clear browser storage:
   ```javascript
   // In browser console (F12):
   localStorage.clear()
   ```
3. Login with correct credentials

---

### 🔴 CORS Error

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Cause:** Backend CORS not configured properly.

**Solution:**
1. Check backend is running: http://localhost:5000
2. Verify CORS configuration in `Citizen-backend/server.js`:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:5173'],
     credentials: true
   }));
   ```
3. Restart backend server

---

### 🔴 MongoDB Connection Error

**Error Message:**
```
MongooseError: Could not connect to MongoDB
```

**Cause:** MongoDB is not running or connection string is incorrect.

**Solution:**

**Option 1: Start MongoDB**
```bash
# Windows
net start MongoDB

# Or start MongoDB Compass and connect
```

**Option 2: Check Connection String**
1. Open `Citizen-backend/.env`
2. Verify `MONGODB_URI`:
   ```
   MONGODB_URI=mongodb://localhost:27017/smc_citizen
   ```
3. Restart backend

---

### 🔴 Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
Error: listen EADDRINUSE: address already in use :::5173
```

**Cause:** Another process is using the port.

**Solution:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or for port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Or change ports:**
- Backend: Edit `Citizen-backend/server.js` → `PORT = 5001`
- Frontend: Edit `citizen-frontend-react/vite.config.js` → `port: 5174`

---

### 🔴 Module Not Found Error

**Error Message:**
```
Error: Cannot find module 'express'
Error: Cannot find module 'react'
```

**Cause:** Dependencies not installed.

**Solution:**
```bash
# Backend
cd Citizen-backend
npm install

# Frontend
cd citizen-frontend-react
npm install
```

---

### 🔴 Image Upload Failed

**Error Message:**
```
Complaint photo is required
File upload failed
```

**Cause:** File too large or invalid format.

**Solution:**
1. Check file size (max 5MB)
2. Use supported formats: JPG, PNG, JPEG
3. Ensure `uploads/complaints/` folder exists in backend
4. Check file permissions

---

### 🔴 AI Analysis Failed

**Error Message:**
```
⚠️ AI analysis failed
```

**Cause:** Gemini AI API key missing or invalid.

**Solution:**
1. Check `.env` file in `Citizen-backend/`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
2. Get API key from: https://makersuite.google.com/app/apikey
3. Restart backend server

**Note:** System continues to work without AI, just without automatic priority calculation.

---

### 🔴 Cannot Login as Officer

**Error Message:**
```
Invalid credentials
```

**Cause:** Officer account doesn't exist.

**Solution:**
1. Create officer account:
   ```bash
   # Run this batch file
   create-officer.bat
   ```

2. Or manually via API:
   ```bash
   curl -X POST http://localhost:5000/api/auth/officer/register \
     -H "Content-Type: application/json" \
     -d "{\"name\":\"Officer Name\",\"phone\":\"1234567890\",\"password\":\"password123\"}"
   ```

3. Login with created credentials at: http://localhost:5173/officer/login

---

### 🔴 Blank Page / White Screen

**Cause:** JavaScript error or build issue.

**Solution:**
1. Open browser console (F12) and check for errors
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart frontend dev server:
   ```bash
   cd citizen-frontend-react
   npm run dev
   ```
4. Check if backend is running: http://localhost:5000

---

### 🔴 Images Not Displaying

**Cause:** Incorrect image path or CORS issue.

**Solution:**
1. Check backend is serving static files:
   ```javascript
   // In server.js
   app.use('/uploads', express.static('uploads'));
   ```
2. Verify image URL format:
   ```
   http://localhost:5000/uploads/complaints/complaint-123.jpg
   ```
3. Check file exists in `Citizen-backend/uploads/complaints/`

---

## Quick Diagnostics

### Check System Status

**1. Backend Status:**
```bash
# Open browser and visit:
http://localhost:5000

# Should see: "SMC Complaint Management API is running"
```

**2. Frontend Status:**
```bash
# Open browser and visit:
http://localhost:5173

# Should see login page
```

**3. MongoDB Status:**
```bash
# In MongoDB Compass, connect to:
mongodb://localhost:27017

# Check if 'smc_citizen' database exists
```

**4. Check Logs:**
```bash
# Backend logs in terminal where you ran:
cd Citizen-backend && npm start

# Frontend logs in terminal where you ran:
cd citizen-frontend-react && npm run dev
```

---

## Browser Console Commands

### Check Authentication
```javascript
// Check if logged in
localStorage.getItem('token')
localStorage.getItem('user')

// Check user role
JSON.parse(localStorage.getItem('user')).role
```

### Clear All Data
```javascript
// Clear everything and start fresh
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Test API Connection
```javascript
// Test backend connection
fetch('http://localhost:5000')
  .then(r => r.text())
  .then(console.log)
```

---

## Still Having Issues?

### 1. Restart Everything
```bash
# Stop all servers (Ctrl+C in terminals)

# Restart backend
cd Citizen-backend
npm start

# Restart frontend (in new terminal)
cd citizen-frontend-react
npm run dev
```

### 2. Clean Install
```bash
# Backend
cd Citizen-backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Frontend
cd citizen-frontend-react
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 3. Check Environment Variables
```bash
# Citizen-backend/.env should have:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smc_citizen
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Verify Node.js Version
```bash
node --version
# Should be v16 or higher

npm --version
# Should be v8 or higher
```

---

## Contact Support

If none of these solutions work:

**Helpline:** 0217-2735293, 0217-2740335  
**Email:** smcwebsite.feedback@gmail.com  
**Office Hours:** Monday-Friday, 9:45 AM - 6:15 PM

---

**Last Updated:** February 8, 2026  
**Version:** 1.0
