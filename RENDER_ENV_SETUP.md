# Render Environment Variables Setup

## 🔴 CRITICAL: Add Missing Environment Variables to Render

Your backend is deployed but missing the `GEMINI_API_KEY` which is causing the 500 error when creating complaints.

## Steps to Fix:

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Find your backend service: `swacchcivic`
- Click on it

### 2. Add Environment Variables
- Click on "Environment" in the left sidebar
- Click "Add Environment Variable"

### 3. Add These Variables:

#### Required Variables:
```
MONGO_URI = <your MongoDB Atlas connection string>
JWT_SECRET = <your JWT secret key>
GEMINI_API_KEY = <your Google Gemini API key>
NODE_ENV = production
PORT = 5000
```

#### Get Your Gemini API Key:
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in Render as `GEMINI_API_KEY`

### 4. Save and Redeploy
- After adding all variables, click "Save Changes"
- Render will automatically redeploy your backend
- Wait 1-2 minutes for deployment to complete

### 5. Test
- Go to your frontend: https://swacchcivic.vercel.app
- Try registering a complaint with camera
- It should work now!

## Verify Environment Variables

Your Render environment should have:
- ✅ MONGO_URI (MongoDB connection)
- ✅ JWT_SECRET (for authentication)
- ✅ GEMINI_API_KEY (for AI analysis)
- ✅ NODE_ENV (set to "production")
- ✅ PORT (set to 5000)

## Troubleshooting

If still getting errors:
1. Check Render logs: Dashboard → Your Service → Logs
2. Look for "Gemini AI analysis error" or "GEMINI_API_KEY"
3. Verify API key is valid at https://makersuite.google.com/app/apikey
4. Make sure there are no extra spaces in the environment variable values
