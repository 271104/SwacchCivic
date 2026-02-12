# 🆓 Deploy SwacchCivic - 100% FREE

Complete guide to deploy your application for FREE using Vercel and MongoDB Atlas free tiers.

---

## 💰 What's Free?

### Vercel (Free Tier)
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions
- ✅ **Cost: $0/month**

### MongoDB Atlas (Free Tier - M0)
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ Perfect for small apps
- ✅ **Cost: $0/month**

**Total Cost: $0/month** 🎉

---

## 🚀 Step-by-Step Free Deployment

### Step 1: MongoDB Atlas (FREE) - 5 minutes

1. **Sign Up**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google/GitHub (fastest)

2. **Create Free Cluster**
   - Choose: **M0 FREE** tier
   - Provider: AWS
   - Region: Choose closest to you
   - Cluster Name: SwacchCivic
   - Click "Create"

3. **Setup Security**
   - Username: `swacchcivic`
   - Password: Generate strong password (save it!)
   - Click "Create User"

4. **Network Access**
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://swacchcivic:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `/swacchcivic` before `?`
   - Final: `mongodb+srv://swacchcivic:yourpassword@cluster0.xxxxx.mongodb.net/swacchcivic?retryWrites=true&w=majority`

---

### Step 2: Seed Database - 2 minutes

Update your local `.env` with Atlas connection:

```bash
# Citizen-backend/.env
MONGO_URI=mongodb+srv://swacchcivic:yourpassword@cluster0.xxxxx.mongodb.net/swacchcivic?retryWrites=true&w=majority
```

Run seed scripts:
```bash
cd Citizen-backend
node scripts/seedDepartments.js
node scripts/createAdmin.js
```

You should see:
```
✅ 5 departments seeded
✅ Admin created
```

---

### Step 3: Deploy Backend to Vercel (FREE) - 3 minutes

1. **Sign Up to Vercel**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub (easiest)
   - Authorize Vercel to access your repositories

2. **Import Project**
   - Click "Add New" → "Project"
   - Find and select "SwacchCivic"
   - Click "Import"

3. **Configure Backend**
   - Framework Preset: **Other**
   - Root Directory: **Citizen-backend**
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   MONGO_URI
   mongodb+srv://swacchcivic:yourpassword@cluster0.xxxxx.mongodb.net/swacchcivic?retryWrites=true&w=majority

   JWT_SECRET
   your_super_secret_jwt_key_change_this_12345

   GEMINI_API_KEY
   AIzaSyCbx6mXX23kGKOA9iXWuxsKkchDjFrtjD8

   NODE_ENV
   production

   PORT
   5000
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Backend deployed!
   - Copy URL: `https://swacchcivic-backend.vercel.app`

---

### Step 4: Deploy Frontend to Vercel (FREE) - 3 minutes

1. **Import Project Again**
   - Go to Vercel dashboard
   - Click "Add New" → "Project"
   - Select "SwacchCivic" again
   - Click "Import"

2. **Configure Frontend**
   - Framework Preset: **Vite**
   - Root Directory: **citizen-frontend-react**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variable**
   Click "Environment Variables" and add:

   ```
   VITE_API_URL
   https://swacchcivic-backend.vercel.app/api
   ```

   Replace with your actual backend URL from Step 3.

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Frontend deployed!
   - Your app is live: `https://swacchcivic.vercel.app`

---

### Step 5: Update CORS - 1 minute

Update `Citizen-backend/server.js` to allow your Vercel frontend:

```javascript
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://swacchcivic.vercel.app",  // Add your frontend URL
        "https://swacchcivic-backend.vercel.app"  // Add your backend URL
    ],
    credentials: true
}));
```

Commit and push:
```bash
git add .
git commit -m "chore: add production CORS URLs"
git push origin main
```

Vercel will automatically redeploy! (takes 1-2 minutes)

---

## ✅ Deployment Complete!

Your app is now live and 100% FREE!

**URLs:**
- Frontend: `https://swacchcivic.vercel.app`
- Backend: `https://swacchcivic-backend.vercel.app`

---

## 🧪 Test Your Deployment

1. Open: `https://swacchcivic.vercel.app`
2. Register as citizen
3. Submit a complaint with image
4. Login as admin:
   - Email: `admin@solapurcorporation.gov.in`
   - Password: `admin123`
5. Approve officers
6. Test all features!

---

## 📊 Free Tier Limits

### Vercel Free Tier
- ✅ 100 GB bandwidth/month (plenty for small-medium apps)
- ✅ 100 GB-hours serverless execution/month
- ✅ Unlimited projects
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains

### MongoDB Atlas Free Tier (M0)
- ✅ 512 MB storage (~10,000 complaints)
- ✅ Shared cluster
- ✅ Perfect for development and small production apps

**Both are permanently free!** No credit card required!

---

## 🎨 Custom Domain (Optional - FREE)

Want your own domain like `swacchcivic.com`?

1. **Buy Domain** (₹500-1000/year from GoDaddy, Namecheap)
2. **Add to Vercel:**
   - Go to project settings
   - Click "Domains"
   - Add your domain
   - Update DNS records as shown
3. **Done!** Vercel provides free HTTPS

---

## 🔄 Auto-Deployment

Every time you push to GitHub, Vercel automatically deploys!

```bash
git add .
git commit -m "feat: new feature"
git push origin main
# Vercel deploys automatically!
```

---

## 💡 Tips for Free Tier

1. **Optimize Images:** Compress images before upload
2. **Monitor Usage:** Check Vercel dashboard for bandwidth
3. **Database Size:** M0 has 512MB, clean old data if needed
4. **Caching:** Vercel caches static assets automatically

---

## 🆙 When to Upgrade?

Stay on free tier unless:
- ❌ Bandwidth > 100 GB/month
- ❌ Database > 512 MB
- ❌ Need dedicated resources
- ❌ Need advanced analytics

For most small-medium apps, **free tier is enough!**

---

## 🐛 Troubleshooting

### Backend not responding
- Check environment variables in Vercel
- Verify MongoDB connection string
- Check Vercel function logs

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS includes your frontend URL
- Check browser console for errors

### Database connection failed
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check username/password in connection string
- Ensure database name is in connection string

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas account created (FREE)
- [ ] Free M0 cluster created
- [ ] Database seeded with departments and admin
- [ ] Backend deployed to Vercel (FREE)
- [ ] Frontend deployed to Vercel (FREE)
- [ ] Environment variables added
- [ ] CORS updated with production URLs
- [ ] App tested and working

---

## 🎉 Success!

Your SwacchCivic app is now:
- ✅ Live on the internet
- ✅ 100% FREE
- ✅ Automatic HTTPS
- ✅ Auto-deploys on git push
- ✅ Professional and scalable

**Total Cost: ₹0/month** 🎊

Share your app: `https://swacchcivic.vercel.app`

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Vercel Community:** https://github.com/vercel/vercel/discussions

---

**Enjoy your FREE deployment!** 🚀
