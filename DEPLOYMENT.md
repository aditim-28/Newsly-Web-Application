# Deployment Guide

## Free Hosting Architecture
- **Frontend**: Netlify (React build)
- **Backend**: Render (Node.js/Express)
- **Database**: MongoDB Atlas (free 512MB cluster)

---

## Step 1: MongoDB Atlas Setup (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account → Create Free Cluster (M0)
3. Choose region closest to your users
4. Database Access → Add Database User (username/password)
5. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Connect → Connect your application → Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/newsly_db?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

1. Go to [Render](https://render.com) → Sign up with GitHub
2. Dashboard → New → Blueprint → Connect your repository
3. Or manually: New → Web Service → Connect GitHub repo `YASHATRE10/Newsly`
4. Configure:
   - **Name**: `newsly-backend`
   - **Root Directory**: leave blank
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. **Environment Variables** (Add in Render dashboard):
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-netlify-app.netlify.app
   MONGODB_URI=<your-atlas-connection-string>
   GNEWS_API_KEY=<your-gnews-key>
   JWT_SECRET=<generate-random-string>
   SESSION_MAX_AGE_MINUTES=30
   ```

6. Deploy → Wait for build (first deploy ~5 min)
7. Copy backend URL: `https://newsly-backend-xxxx.onrender.com`

**Note**: Free Render instances sleep after 15 min of inactivity (cold starts ~30s).

---

## Step 3: Deploy Frontend to Netlify

### Option A: Via GitHub (Recommended)

1. Go to [Netlify](https://netlify.com) → Sign up with GitHub
2. Add new site → Import from Git → Select `YASHATRE10/Newsly`
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

4. **Environment Variables** (Site settings → Environment variables):
   ```
   REACT_APP_API_URL=https://newsly-backend-xxxx.onrender.com/api
   ```

5. Deploy → Netlify will auto-deploy on every push to `main`

### Option B: Manual Deploy

```powershell
# Build frontend
cd F:\Aditi\newsly\newsly\frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=build
```

6. Copy frontend URL: `https://your-app.netlify.app`

---

## Step 4: Update CORS Origins

1. Go back to Render backend environment variables
2. Update `FRONTEND_URL` with your Netlify URL:
   ```
   FRONTEND_URL=https://your-app.netlify.app
   ```
3. Redeploy backend (Render dashboard → Manual Deploy)

---

## Step 5: Update Frontend API Base URL

### If using environment variable:
In Netlify, set `REACT_APP_API_URL` to your backend URL.

### Or update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://newsly-backend-xxxx.onrender.com/api';
```

Rebuild and redeploy frontend after this change.

---

## Testing Deployment

1. **Backend Health**: Visit `https://newsly-backend-xxxx.onrender.com/health`
   - Should return: `{"status":"Server is running","database":"connected"}`

2. **Frontend**: Visit `https://your-app.netlify.app`
   - Test sign-up/login
   - Check dashboard loads news
   - Verify regional news and e-papers work

---

## Cost Summary

| Service | Plan | Limits |
|---------|------|--------|
| MongoDB Atlas | M0 Free | 512MB storage, shared CPU |
| Render | Free | 750 hours/month, sleeps after 15min idle |
| Netlify | Free | 100GB bandwidth/month, 300 build minutes/month |

**Total**: $0/month ✅

---

## Troubleshooting

### Backend sleeps (Render Free)
- First request after idle takes ~30s to wake up
- Use a cron job or uptime monitor (e.g., UptimeRobot) to ping `/health` every 10 min

### CORS errors
- Ensure `FRONTEND_URL` in Render matches your Netlify URL exactly
- Check backend logs in Render dashboard

### MongoDB connection fails
- Verify IP whitelist includes `0.0.0.0/0` in Atlas Network Access
- Check connection string has correct username/password

### Build fails on Netlify
- Ensure `package.json` is in `frontend/` directory
- Check Node version compatibility (Netlify uses Node 18 by default)

---

## Custom Domain (Optional)

### Netlify:
1. Domain settings → Add custom domain
2. Update DNS records as instructed

### Render:
1. Settings → Custom Domain → Add your domain
2. Update DNS CNAME to Render

---

## Auto-Deploy Setup

Both platforms support automatic deployment:
- **Push to `main` branch** → Auto-deploys to Netlify + Render
- Configure branch deploys in dashboard for staging environments

---

## Monitoring

- **Render**: Check logs and metrics in dashboard
- **Netlify**: Function logs and analytics available
- **MongoDB Atlas**: Monitor cluster performance and usage

---

## Next Steps

1. Set up environment variables in Render + Netlify
2. Test all features in production
3. Monitor initial usage and performance
4. Consider upgrading plans if you exceed free tier limits
