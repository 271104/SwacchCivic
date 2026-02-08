# Citizen Login Troubleshooting Guide

## 🔍 Problem
Unable to login as citizen in citizen portal with correct credentials.

## 🧪 Quick Diagnosis

### Step 1: Test with HTML Tool
1. Open `test-citizen-login.html` in browser
2. Click "Check Backend" - Should show "✅ Backend is running"
3. Click "Register Citizen" - Creates test account
4. Click "Login" - Tests login with same credentials

### Step 2: Test with Node Script
```bash
cd Citizen-backend
node ../test-citizen-login.js
```

This will:
- Check database for existing citizens
- Try common test passwords
- Show detailed error messages

## 🎯 Common Issues & Solutions

### Issue 1: "Invalid credentials"

**Possible Causes:**
1. Wrong phone number
2. Wrong password
3. Phone not registered

**Solutions:**

**A. Verify phone number exists:**
```javascript
// In MongoDB shell or Compass
use smc_db
db.citizens.find({ phone: "YOUR_PHONE_NUMBER" })
```

**B. Register new citizen:**
- Open: http://localhost:5173/register
- Fill in details
- Use unique phone number
- Password must be 6+ characters

**C. Reset password in database:**
```javascript
// In MongoDB shell
use smc_db

// Generate new password hash (for password: test123)
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('test123', 10);

// Update citizen password
db.citizens.updateOne(
  { phone: "YOUR_PHONE_NUMBER" },
  { $set: { password: hash } }
)
```

### Issue 2: "Account is inactive"

**Cause:** `isActive` field is set to `false`

**Solution:**
```javascript
// In MongoDB shell
use smc_db
db.citizens.updateOne(
  { phone: "YOUR_PHONE_NUMBER" },
  { $set: { isActive: true } }
)
```

### Issue 3: Backend not responding

**Symptoms:**
- Network error
- Connection refused
- CORS error

**Solutions:**

**A. Check if backend is running:**
```bash
# Open http://localhost:5000 in browser
# Should show: "SMC API running"
```

**B. Start backend:**
```bash
cd Citizen-backend
node server.js
```

**C. Check for errors:**
```bash
# Look for these in backend console:
✅ MongoDB connected
📌 DB Name: smc_db
🚀 Server running on port 5000
```

### Issue 4: Wrong phone format

**Problem:** Phone number has spaces, dashes, or country code

**Wrong:**
- +91 9876543210
- 98765-43210
- 98765 43210

**Correct:**
- 9876543210

**Solution:** Use only digits, no spaces or special characters

### Issue 5: Password too short

**Problem:** Password less than 6 characters

**Solution:** Use password with 6 or more characters

### Issue 6: Database connection issues

**Symptoms:**
- "Server error while logging in"
- Backend shows MongoDB connection error

**Solutions:**

**A. Check MongoDB is running:**
```bash
# Windows
services.msc
# Look for MongoDB service

# Or check connection
mongosh
```

**B. Check connection string:**
```bash
# In Citizen-backend/.env
MONGO_URI=mongodb://127.0.0.1:27017/smc_db
```

**C. Verify database name:**
```javascript
// In MongoDB shell
show dbs
use smc_db
show collections
// Should see: citizens, officers, admins, departments, complaints
```

## 🔧 Testing Workflow

### 1. Create Test Citizen

**Option A - Using HTML Tool:**
1. Open `test-citizen-login.html`
2. Fill in registration form
3. Click "Register Citizen"
4. Should see success message

**Option B - Using API directly:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9999999999","password":"test123"}'
```

**Option C - Using Frontend:**
1. Go to http://localhost:5173/register
2. Fill in form
3. Submit

### 2. Verify in Database

```javascript
// MongoDB shell
use smc_db
db.citizens.find({ phone: "9999999999" })

// Should return:
{
  _id: ObjectId("..."),
  name: "Test User",
  phone: "9999999999",
  password: "$2a$10$...", // Hashed
  role: "citizen",
  isActive: true,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### 3. Test Login

**Option A - Using HTML Tool:**
1. Open `test-citizen-login.html`
2. Enter phone and password
3. Click "Login"
4. Should see success with token

**Option B - Using API directly:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","password":"test123"}'
```

**Option C - Using Frontend:**
1. Go to http://localhost:5173/login
2. Enter credentials
3. Click "Sign In"
4. Should redirect to dashboard

## 📊 Debug Checklist

### Backend
- [ ] Backend server running on port 5000
- [ ] MongoDB connected successfully
- [ ] No errors in backend console
- [ ] Can access http://localhost:5000
- [ ] CORS configured for frontend origin

### Database
- [ ] MongoDB service running
- [ ] Database `smc_db` exists
- [ ] Collection `citizens` exists
- [ ] Citizen record exists with correct phone
- [ ] Citizen `isActive` is `true`
- [ ] Password is hashed (starts with $2a$ or $2b$)

### Frontend
- [ ] Frontend running on port 5173
- [ ] Can access login page
- [ ] No console errors (F12)
- [ ] API calls going to correct URL
- [ ] Network tab shows requests

### Credentials
- [ ] Phone number is correct (digits only)
- [ ] Password is correct
- [ ] Password is 6+ characters
- [ ] No extra spaces in input

## 🔍 Advanced Debugging

### Enable Backend Logging

Add to `Citizen-backend/routes/auth.js` login route:

```javascript
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // ADD THESE LOGS
    console.log('🔐 Login attempt:', { phone });
    
    const citizen = await Citizen.findOne({ phone });
    console.log('👤 Citizen found:', citizen ? 'Yes' : 'No');
    
    if (!citizen) {
      console.log('❌ No citizen with phone:', phone);
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log('✅ Citizen active:', citizen.isActive);
    
    const isMatch = await bcrypt.compare(password, citizen.password);
    console.log('🔑 Password match:', isMatch);
    
    // ... rest of code
  }
});
```

### Check Browser Console

Press F12 and look for:
- Network errors
- CORS errors
- API response codes
- Error messages

### Check Network Tab

1. Press F12 → Network tab
2. Try to login
3. Look for POST request to `/api/auth/login`
4. Check:
   - Request payload (phone, password)
   - Response status (200, 400, 403, 500)
   - Response body (error message)

## 📝 Test Credentials

### Default Test Citizen
After running `test-citizen-login.html`:
```
Phone: 9999999999
Password: test123
```

### Create Your Own
1. Use unique phone number
2. Use memorable password (6+ chars)
3. Register through frontend or test tool
4. Save credentials for testing

## 🎯 Expected Behavior

### Successful Login
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "...",
    "name": "Test User",
    "phone": "9999999999",
    "role": "citizen"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Failed Login (Wrong Credentials)
```json
{
  "message": "Invalid credentials"
}
```

### Failed Login (Inactive Account)
```json
{
  "message": "Account is inactive"
}
```

## 🚀 Quick Fix Commands

### Reset Test Citizen Password
```javascript
// MongoDB shell
use smc_db
const bcrypt = require('bcryptjs');
db.citizens.updateOne(
  { phone: "9999999999" },
  { 
    $set: { 
      password: "$2a$10$YourHashedPasswordHere",
      isActive: true 
    } 
  }
)
```

### Create Test Citizen Directly
```javascript
// MongoDB shell
use smc_db
const bcrypt = require('bcryptjs');
db.citizens.insertOne({
  name: "Test Citizen",
  phone: "9999999999",
  password: "$2a$10$8K1p/a0dL3.I8.F9R.Hn3OqKqb5qg5JvHkqRZGqZ5qg5JvHkqRZGq", // test123
  role: "citizen",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 📞 Support

If still having issues:
1. Run `test-citizen-login.js` and share output
2. Check backend console for errors
3. Check browser console for errors
4. Verify MongoDB has citizen records
5. Try with test-citizen-login.html
6. Check all services are running

## 🔗 Related Files
- `test-citizen-login.html` - Browser test tool
- `test-citizen-login.js` - Node.js test script
- `Citizen-backend/routes/auth.js` - Login logic
- `Citizen-backend/models/Citizen.js` - Citizen model
- `citizen-frontend-react/src/pages/citizen/Login.jsx` - Login UI

---

**Most Common Solution:** Register a new test citizen with known credentials and try logging in with those.
