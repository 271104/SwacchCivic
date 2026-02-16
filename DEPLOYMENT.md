# Deployment Checklist

## ✅ Backend (Already Deployed on Render)
- URL: https://swacchcivic.onrender.com
- Status: Live and running

### After Frontend Deployment - Update CORS
Once you deploy the frontend, update `Citizen-backend/server.js`:
```javascript
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-frontend-url.vercel.app"  // Add your actual frontend URL
    ],
    credentials: true
}));
```

## ✅ Frontend Configuration (Ready for Deployment)

### Files Updated:
1. `citizen-frontend-react/src/services/api.js` - API URL set to production
2. `citizen-frontend-react/src/services/adminAPI.js` - API URL set to production
3. `citizen-frontend-react/.env.production` - Environment variables configured

### Deploy to Vercel (Recommended):

1. Install Vercel CLI (if not already):
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend folder:
   ```bash
   cd citizen-frontend-react
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow prompts:
   - Link to existing project or create new
   - Set project name: `swacchcivic-frontend`
   - Build command: `npm run build`
   - Output directory: `dist`

5. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://swacchcivic.onrender.com/api`

### Alternative: Deploy to Netlify

1. Build the project:
   ```bash
   cd citizen-frontend-react
   npm run build
   ```

2. Deploy `dist` folder to Netlify
3. Set environment variable: `VITE_API_URL` = `https://swacchcivic.onrender.com/api`

## 🔧 Post-Deployment Steps

1. Get your frontend URL (e.g., `https://swacchcivic.vercel.app`)

2. Update backend CORS in `Citizen-backend/server.js`:
   ```javascript
   origin: [
       "http://localhost:5173",
       "https://swacchcivic.vercel.app"  // Your actual URL
   ]
   ```

3. Commit and push backend changes to trigger Render redeploy

4. Test the application:
   - Citizen registration and login
   - Camera capture with geolocation
   - Complaint submission
   - Admin login
   - Officer login

## 📱 Testing on Mobile

Once deployed, you can:
- Open the frontend URL on your phone browser
- Camera and geolocation will work properly
- Test the full complaint registration flow

## 🔐 Admin Credentials
- Email: admin@solapurcorporation.gov.in
- Password: admin123

## 📞 Support Contact
- Helpline: 0217-2735293, 0217-2740335
- Email: smcwebsite.feedback@gmail.com
