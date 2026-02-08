# Admin Portal Debug Guide

## Issue
Admin portal showing "Failed to load officers" and "Failed to load pending officers" even though officers exist in database.

## Root Cause
The backend `routes/admin/officers.js` file was still using the old `User` model instead of the new `Officer` model in several endpoints (reject, revoke, activate, department change, and delete).

## Fix Applied
Updated all officer routes to use the `Officer` model consistently:
- ✅ `/api/admin/officers/:id/reject` - Now uses `Officer.findById()`
- ✅ `/api/admin/officers/:id/revoke` - Now uses `Officer.findById()`
- ✅ `/api/admin/officers/:id/activate` - Now uses `Officer.findById()`
- ✅ `/api/admin/officers/:id/department` - Now uses `Officer.findById()`
- ✅ `/api/admin/officers/:id` (DELETE) - Now uses `Officer.findById()`

## Testing Steps

### 1. Restart Backend Server
```bash
cd Citizen-backend
node server.js
```

### 2. Test Admin Login
Open `test-admin-api.html` in your browser and:
1. Click "Login" button (credentials pre-filled)
2. Verify you see "✅ Login successful!"
3. Check that token is stored

### 3. Test Pending Officers API
1. Click "Get Pending Officers" button
2. You should see the pending officer (Shubham Charate)
3. Verify the response shows:
   ```json
   {
     "officers": [...],
     "count": 1
   }
   ```

### 4. Test Admin Portal
1. Open admin portal: http://localhost:5173/admin/login
2. Login with: admin@solapurcorporation.gov.in / admin123
3. Navigate to "Pending Approvals"
4. You should now see the pending officer

### 5. Browser Console Debugging
Open browser console (F12) and check for:
- ✅ "🔍 Fetching pending officers..."
- ✅ "Admin token: Present"
- ✅ "✅ Pending officers data: {...}"

If you see errors:
- ❌ "Admin token: Missing" → Login again
- ❌ 401 Unauthorized → Token expired, login again
- ❌ 500 Server Error → Check backend console for errors

## Common Issues

### Issue: "Failed to load pending officers"
**Cause**: Token not being sent or backend error
**Solution**: 
1. Check localStorage has `adminToken`
2. Restart backend server
3. Login again to get fresh token

### Issue: Empty officers list
**Cause**: No pending officers in database
**Solution**: Register a new officer at `/officer/register`

### Issue: CORS errors
**Cause**: Backend not allowing frontend origin
**Solution**: Check backend CORS configuration in `server.js`

### Issue: Rate limiting
**Cause**: Too many requests in short time
**Solution**: Wait 15 minutes or restart backend

## Verification Checklist
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Admin can login successfully
- [ ] Token stored in localStorage
- [ ] Pending officers API returns data
- [ ] Admin portal shows pending officers
- [ ] Can approve/reject officers

## Database Verification
Check MongoDB directly:
```javascript
// In MongoDB shell or Compass
use citizen_portal

// Check pending officers
db.officers.find({ status: 'pending' })

// Check admin exists
db.admins.find({ email: 'admin@solapurcorporation.gov.in' })

// Check departments
db.departments.find()
```

## API Endpoints Reference

### Admin Authentication
- POST `/api/admin/login` - Admin login
- GET `/api/admin/profile` - Get admin profile

### Officer Management
- GET `/api/admin/officers/pending` - Get pending officers
- GET `/api/admin/officers` - Get all officers (with filters)
- GET `/api/admin/officers/:id` - Get officer details
- PUT `/api/admin/officers/:id/approve` - Approve officer
- PUT `/api/admin/officers/:id/reject` - Reject officer
- PUT `/api/admin/officers/:id/revoke` - Revoke officer access
- PUT `/api/admin/officers/:id/activate` - Reactivate officer
- PUT `/api/admin/officers/:id/department` - Change department
- DELETE `/api/admin/officers/:id` - Delete officer

All officer endpoints require `Authorization: Bearer <token>` header.

## Next Steps
1. Restart backend server
2. Test with `test-admin-api.html`
3. Login to admin portal
4. Verify pending officers appear
5. Test approve/reject functionality

## Support
If issues persist:
1. Check backend console for errors
2. Check browser console for errors
3. Verify MongoDB connection
4. Check network tab for API responses
5. Verify token is being sent in headers
