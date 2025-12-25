# 🚀 Deploy Newsly Now - Quick Start

Follow these steps in order. Total time: ~20 minutes.

---

## ✅ Step 1: MongoDB Atlas (Database) - 5 minutes

1. **Sign up**: Go to https://www.mongodb.com/cloud/atlas/register
   - Use your Google/GitHub account for quick signup

2. **Create Free Cluster**:
   - Click "Build a Database"
   - Choose **FREE** (M0 - 512MB)
   - Select AWS and region closest to you
   - Cluster Name: `newsly-cluster` (or any name)
   - Click "Create"

3. **Create Database User**:
   - Security → Database Access → Add New Database User
   - Username: `newsly_user` (or any name)
   - Password: **Auto-generate** (copy it!)
   - Role: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**:
   - Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere"
   - IP: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://newsly_user:<password>@newsly-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with the password you copied
   - Add database name at the end: `...mongodb.net/newsly_db?retryWrites=true...`

**✅ You now have**: MongoDB connection string (save it!)

---

## ✅ Step 2: Deploy Backend to Render - 10 minutes

1. **Sign up**: Go to https://render.com
   - Click "Get Started for Free"
   - Choose "Sign in with GitHub"
   - Authorize Render to access your repos

2. **Create Web Service**:
   - Dashboard → Click "New +" → "Web Service"
   - Connect your GitHub repository: `YASHATRE10/Newsly`
   - Click "Connect"

3. **Configure Service**:
   - **Name**: `newsly-backend` (must be unique)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: leave **blank**
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: `Free`

4. **Add Environment Variables**:
   Scroll down to "Environment Variables" → Click "Add Environment Variable" for each:
   
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = <paste your MongoDB connection string from Step 1>
   GNEWS_API_KEY = <your GNews API key>
   JWT_SECRET = <type any random long string, like: mySecretKey12345RandomString67890>
   SESSION_MAX_AGE_MINUTES = 30
   FRONTEND_URL = https://newsly.netlify.app
   ```
   
   **Note**: We'll update `FRONTEND_URL` later with your actual Netlify URL

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 3-5 minutes for first deploy
   - Check logs for "Server running on http://0.0.0.0:5000"
   - Once deployed, copy your backend URL: `https://newsly-backend-xxxx.onrender.com`

6. **Test Backend**:
   - Visit: `https://newsly-backend-xxxx.onrender.com/health`
   - Should see: `{"status":"Server is running","database":"connected"}`
   - ✅ Backend is live!

**✅ You now have**: Backend URL (save it!)

---

## ✅ Step 3: Deploy Frontend to Netlify - 5 minutes

1. **Sign up**: Go to https://app.netlify.com/signup
   - Choose "Sign up with GitHub"
   - Authorize Netlify

2. **Import Project**:
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Find and select your repo: `YASHATRE10/Newsly`
   - Click on it

3. **Configure Build**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - Click "Show advanced" → Add environment variable:
     ```
     REACT_APP_API_URL = <paste your Render backend URL from Step 2>/api
     ```
     Example: `https://newsly-backend-xxxx.onrender.com/api`

4. **Deploy**:
   - Click "Deploy site"
   - Wait 2-3 minutes for build
   - Once done, you'll see your site URL: `https://random-name-12345.netlify.app`

5. **Optional - Change Site Name**:
   - Site settings → Change site name
   - Choose: `newsly-yourname` (must be unique)
   - New URL: `https://newsly-yourname.netlify.app`

**✅ You now have**: Frontend URL (save it!)

---

## ✅ Step 4: Update CORS - 2 minutes

Now that you have your Netlify URL, update backend to allow it:

1. Go back to **Render Dashboard**
2. Click on your `newsly-backend` service
3. Go to "Environment" tab
4. Find `FRONTEND_URL` variable
5. Update its value to your Netlify URL: `https://newsly-yourname.netlify.app`
6. Click "Save Changes"
7. Render will automatically redeploy (wait 1-2 min)

---

## ✅ Step 5: Test Your Live Site! 🎉

1. **Open your Netlify URL**: `https://newsly-yourname.netlify.app`
2. **Test features**:
   - ✅ Homepage loads
   - ✅ Sign up with email/password
   - ✅ Sign in works
   - ✅ Dashboard shows news (might take 30s first time - backend waking up)
   - ✅ Regional news works
   - ✅ E-papers display

3. **If something doesn't work**:
   - Open browser DevTools (F12) → Console
   - Check for errors
   - Common issues below ⬇️

---

## 🔧 Troubleshooting

### "Network Error" or CORS errors
- **Fix**: Make sure `FRONTEND_URL` in Render matches your Netlify URL exactly (no trailing slash)
- Redeploy backend after changing

### Backend responds slowly (30+ seconds)
- **Normal**: Render free tier sleeps after 15 min. First request wakes it up
- **Solution**: Use https://uptimerobot.com (free) to ping `/health` every 10 minutes

### "Database not connected"
- **Fix**: Check MongoDB connection string in Render env vars
- Make sure password doesn't have special characters (use alphanumeric only)
- Verify Network Access allows `0.0.0.0/0` in MongoDB Atlas

### News not loading
- **Fix**: Check if GNews API key is valid
- Test backend directly: `https://your-backend.onrender.com/api/news/headlines`

### Can't sign up/login
- **Fix**: Check MongoDB connection
- Verify JWT_SECRET is set in Render

---

## 📱 Share Your App

Once everything works:
- **Live URL**: `https://newsly-yourname.netlify.app`
- Share it with anyone!
- Backend API: `https://newsly-backend-xxxx.onrender.com`

---

## 🔄 Auto-Deploy Setup (Already Done!)

Good news: Auto-deploy is already configured!
- **Every time you push to GitHub** → Both Netlify and Render auto-deploy
- Just run: `git push origin main`

---

## 💰 Cost

- **MongoDB Atlas M0**: FREE (512MB)
- **Render Free**: FREE (750 hours/month)
- **Netlify Free**: FREE (100GB bandwidth/month)

**Total**: $0/month forever! 🎉

---

## 🎯 Summary Checklist

- [ ] MongoDB Atlas cluster created + connection string saved
- [ ] Render backend deployed + URL saved
- [ ] Netlify frontend deployed + URL saved
- [ ] FRONTEND_URL updated in Render
- [ ] Website tested and working
- [ ] Bookmarked your live URL!

---

## 📞 Need Help?

If you get stuck:
1. Check Render logs: Dashboard → Your service → Logs
2. Check Netlify logs: Site → Deploys → Click latest deploy → View logs
3. Check browser console (F12) for frontend errors

Most common issue: CORS errors → Fix by updating FRONTEND_URL in Render

---

**You're all set! Start with Step 1 above. Good luck! 🚀**
