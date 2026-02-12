# 🆓 Deploy FREE - Quick Checklist

## ⚡ 15 Minutes to Live App (100% FREE)

### ✅ Step 1: MongoDB Atlas (5 min)
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create **M0 FREE** cluster
3. Create user: `swacchcivic` / `yourpassword`
4. Network: Allow `0.0.0.0/0`
5. Get connection string:
   ```
   mongodb+srv://swacchcivic:yourpassword@cluster0.xxxxx.mongodb.net/swacchcivic?retryWrites=true&w=majority
   ```

### ✅ Step 2: Seed Database (2 min)
```bash
# Update Citizen-backend/.env
MONGO_URI=mongodb+srv://swacchcivic:yourpassword@...

# Seed
cd Citizen-backend
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

### ✅ Step 3: Deploy Backend (3 min)
1. Sign up: https://vercel.com/signup (use GitHub)
2. Import: SwacchCivic
3. Root: `Citizen-backend`
4. Add env vars:
   - `MONGO_URI`: (your Atlas connection)
   - `JWT_SECRET`: `your_secret_key_123`
   - `GEMINI_API_KEY`: `AIzaSyCbx6mXX23kGKOA9iXWuxsKkchDjFrtjD8`
   - `NODE_ENV`: `production`
5. Deploy!
6. Copy URL: `https://your-backend.vercel.app`

### ✅ Step 4: Deploy Frontend (3 min)
1. Import: SwacchCivic (again)
2. Root: `citizen-frontend-react`
3. Framework: Vite
4. Add env var:
   - `VITE_API_URL`: `https://your-backend.vercel.app/api`
5. Deploy!
6. Your app: `https://your-app.vercel.app`

### ✅ Step 5: Update CORS (2 min)
In `Citizen-backend/server.js`:
```javascript
origin: [
    "http://localhost:5173",
    "https://your-app.vercel.app"  // Add this
]
```

```bash
git add .
git commit -m "chore: add production CORS"
git push
```

---

## 🎉 Done!

**Your app is live:** `https://your-app.vercel.app`

**Cost:** ₹0/month (FREE forever!)

---

## 🧪 Test
1. Open your app URL
2. Register as citizen
3. Submit complaint
4. Login as admin: `admin@solapurcorporation.gov.in` / `admin123`

---

**For detailed guide:** [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md)
