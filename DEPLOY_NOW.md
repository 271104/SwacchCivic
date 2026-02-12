# 🚀 Deploy to Vercel - Quick Guide

## ⚡ Quick Deployment Steps

### 1. Setup MongoDB Atlas (5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swacchcivic
   ```
4. Allow access from anywhere: `0.0.0.0/0`

### 2. Deploy Backend (3 minutes)
1. Go to https://vercel.com/new
2. Import `SwacchCivic` repository
3. Root Directory: `Citizen-backend`
4. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=AIzaSyCbx6mXX23kGKOA9iXWuxsKkchDjFrtjD8
   NODE_ENV=production
   ```
5. Deploy!
6. Copy backend URL: `https://your-backend.vercel.app`

### 3. Update Frontend Config (1 minute)
Edit `citizen-frontend-react/.env.production`:
```
VITE_API_URL=https://your-backend.vercel.app/api
```

### 4. Deploy Frontend (3 minutes)
1. Go to https://vercel.com/new
2. Import `SwacchCivic` repository again
3. Root Directory: `citizen-frontend-react`
4. Framework: Vite
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
6. Deploy!

### 5. Seed Database (2 minutes)
```bash
# Update local .env with Atlas connection
MONGO_URI=mongodb+srv://...

# Seed
cd Citizen-backend
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

### 6. Update CORS (1 minute)
In `Citizen-backend/server.js`, add your Vercel URL:
```javascript
origin: [
    "http://localhost:5173",
    "https://your-app.vercel.app"  // Add this
]
```

Commit and push:
```bash
git add .
git commit -m "chore: add production CORS"
git push
```

Vercel will auto-deploy!

---

## ✅ Done!

Your app is live at:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.vercel.app

---

## 🧪 Test It

1. Open: https://your-app.vercel.app
2. Register as citizen
3. Submit complaint
4. Login as admin: admin@solapurcorporation.gov.in / admin123

---

**Total Time: ~15 minutes** 🎉

For detailed guide, see: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
