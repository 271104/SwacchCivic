# 🚀 Deploy SwacchCivic to Vercel

Complete guide to deploy your SwacchCivic application to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Your code is already on GitHub (SwacchCivic)
3. **MongoDB Atlas** - For production database (free tier available)
4. **Gemini API Key** - Your existing key will work

---

## 🎯 Deployment Strategy

We'll deploy in two parts:
1. **Backend** - Deploy as Vercel Serverless Function
2. **Frontend** - Deploy as Static Site

---

## 📦 Step 1: Prepare MongoDB Atlas (Production Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free M0 tier)

### 1.2 Setup Database
1. Click "Connect" on your cluster
2. Add your IP address (or allow access from anywhere: `0.0.0.0/0`)
3. Create database user with username and password
4. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/swacchcivic?retryWrites=true&w=majority
   ```

### 1.3 Seed Production Database
```bash
# Update .env with Atlas connection string
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swacchcivic

# Run seed scripts
cd Citizen-backend
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

---

## 🚀 Step 2: Deploy Backend to Vercel

### 2.1 Create Backend Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `SwacchCivic`
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `Citizen-backend`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)

### 2.2 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swacchcivic
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
GEMINI_API_KEY=AIzaSyCbx6mXX23kGKOA9iXWuxsKkchDjFrtjD8
NODE_ENV=production
```

**Important:** Generate a new strong JWT_SECRET for production!

### 2.3 Deploy Backend
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-backend.vercel.app`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Update Frontend API URL

Before deploying frontend, update the production API URL:

**File:** `citizen-frontend-react/.env.production`
```
VITE_API_URL=https://your-backend.vercel.app/api
```

Replace `your-backend.vercel.app` with your actual backend URL from Step 2.3.

### 3.2 Create Frontend Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `SwacchCivic` (again)
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `citizen-frontend-react`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.3 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend.vercel.app/api
```

### 3.4 Deploy Frontend
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be live at: `https://your-app.vercel.app`

---

## ⚙️ Alternative: Single Deployment (Monorepo)

If you want to deploy both frontend and backend together:

### Update vercel.json (already created)
The `vercel.json` file is configured to:
- Build backend as serverless function
- Build frontend as static site
- Route `/api/*` to backend
- Route everything else to frontend

### Deploy
1. Go to Vercel dashboard
2. Import SwacchCivic repository
3. **Root Directory:** Leave as root (.)
4. Add all environment variables
5. Deploy

---

## 🔧 Configuration Files Created

### 1. vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Citizen-backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "citizen-frontend-react/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "citizen-frontend-react/dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "Citizen-backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "citizen-frontend-react/dist/$1"
    }
  ]
}
```

### 2. .env.production (Frontend)
```
VITE_API_URL=https://your-backend.vercel.app/api
```

### 3. Updated API Services
- `citizen-frontend-react/src/services/api.js`
- `citizen-frontend-react/src/services/adminAPI.js`

Both now use `import.meta.env.VITE_API_URL` for dynamic API URL.

---

## 🔒 Security Checklist

Before deploying:
- [ ] Change default admin password
- [ ] Generate new JWT_SECRET (use: `openssl rand -base64 32`)
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Add your domain to CORS whitelist
- [ ] Enable MongoDB IP whitelist (or use 0.0.0.0/0 for Vercel)
- [ ] Keep API keys secure in Vercel environment variables
- [ ] Enable HTTPS (Vercel does this automatically)

---

## 🌐 Update CORS for Production

**File:** `Citizen-backend/server.js`

Update CORS configuration:
```javascript
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-app.vercel.app",  // Add your Vercel frontend URL
        "https://your-custom-domain.com"  // Add custom domain if any
    ],
    credentials: true
}));
```

---

## 📝 Post-Deployment Steps

### 1. Test Your Deployment

**Backend Health Check:**
```
https://your-backend.vercel.app/
```
Should return: "SMC API running"

**Frontend:**
```
https://your-app.vercel.app
```
Should show login page

### 2. Test Features
- [ ] Citizen registration
- [ ] Citizen login
- [ ] Submit complaint
- [ ] Officer registration
- [ ] Admin login
- [ ] Approve officer
- [ ] AI analysis working

### 3. Update Repository Settings
Add deployment URLs to README.md:
```markdown
## 🌐 Live Demo
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-backend.vercel.app
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** 
- Check MongoDB Atlas connection string
- Verify IP whitelist includes `0.0.0.0/0`
- Check username/password are correct

### Issue: "API calls failing"
**Solution:**
- Verify VITE_API_URL is set correctly
- Check CORS configuration includes your Vercel URL
- Check backend environment variables

### Issue: "AI analysis not working"
**Solution:**
- Verify GEMINI_API_KEY is set in Vercel
- Check API key is valid
- Review backend logs in Vercel dashboard

### Issue: "Build failed"
**Solution:**
- Check all dependencies are in package.json
- Verify build command is correct
- Check Vercel build logs for errors

---

## 📊 Vercel Limits (Free Tier)

- **Bandwidth:** 100 GB/month
- **Serverless Function Execution:** 100 GB-hours/month
- **Builds:** Unlimited
- **Deployments:** Unlimited
- **Custom Domains:** Unlimited

For production with high traffic, consider upgrading to Pro plan.

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys!
```

---

## 📱 Custom Domain (Optional)

### Add Custom Domain
1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., swacchcivic.com)
4. Update DNS records as instructed
5. Wait for DNS propagation (5-10 minutes)

### Update CORS
Add your custom domain to CORS whitelist in `server.js`

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] MongoDB Atlas setup complete
- [ ] Database seeded with departments and admin
- [ ] Environment variables prepared
- [ ] CORS updated with production URLs
- [ ] JWT_SECRET changed from default
- [ ] API URL updated in frontend .env.production

### During Deployment
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables added to Vercel
- [ ] Build completed without errors

### After Deployment
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Can register and login
- [ ] Can submit complaints
- [ ] AI analysis working
- [ ] Admin portal accessible
- [ ] Officer approval working

---

## 🎉 Success!

Your SwacchCivic application is now live on Vercel!

**Next Steps:**
1. Share your deployment URL
2. Test all features thoroughly
3. Monitor Vercel analytics
4. Set up custom domain (optional)
5. Enable Vercel Analytics (optional)

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs
**MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
**Vercel Support:** https://vercel.com/support

---

**Ready to deploy? Follow the steps above!** 🚀
