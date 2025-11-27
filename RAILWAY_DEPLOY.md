# Railway Deployment - Quick Start Guide

## 🚀 Deploy Your Crypto Tracker to Railway.app (100% FREE)

Railway.app offers **500 hours/month FREE** - no credit card required!

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account (no credit card)
3. Create **M0 FREE** cluster
4. Create database user:
   - Username: `cryptouser`
   - Password: (create strong password and save it!)
5. Network Access: **Allow Access from Anywhere** (0.0.0.0/0)
6. Get connection string:
   ```
   mongodb+srv://cryptouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptotracker?retryWrites=true&w=majority
   ```
   **SAVE THIS!**

---

## Step 2: Deploy to Railway (5 minutes)

1. Go to https://railway.app
2. Click **"Login"** → Sign in with **GitHub**
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select: `crypto-portfolio-tracker`
5. Railway will auto-deploy!

---

## Step 3: Add Environment Variables

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add:

   | Variable | Value |
   |----------|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `PORT` | `3000` |
   | `NODE_ENV` | `production` |

4. Railway will automatically redeploy

---

## Step 4: Get Your URL

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. You'll get: `https://your-app.up.railway.app`
5. **SAVE THIS URL!**

---

## Step 5: Test Your Deployment

Visit these URLs (replace with your Railway URL):

- `https://your-app.up.railway.app/api/exchanges` ✅ Should return JSON
- `https://your-app.up.railway.app/api/portfolio` ✅ Should return `[]`

---

## Step 6: Update Your Mobile App

1. Open `client/src/api/socket.js`:
   ```javascript
   const SOCKET_URL = 'https://your-app.up.railway.app';
   ```

2. Open `client/src/api/api.js`:
   ```javascript
   const API_URL = 'https://your-app.up.railway.app/api';
   ```

3. Test your app:
   ```bash
   cd client
   npm run android
   ```

---

## ✅ You're Done!

Your crypto tracker is now:
- ✅ Deployed to production
- ✅ Accessible from anywhere
- ✅ 100% FREE (no credit card)
- ✅ Auto-deploys on git push

---

## 🔧 Troubleshooting

### Build Failed?

**Check the logs in Railway dashboard:**
- The `nixpacks.toml` file configures Node.js 20
- If build fails, ensure all files are pushed to GitHub

### Can't Connect to MongoDB?

**Check:**
1. Connection string is correct in Railway variables
2. MongoDB Network Access allows `0.0.0.0/0`
3. Password doesn't have special characters (or is URL-encoded)

### API Returns 404?

**Check:**
1. Deployment completed successfully
2. Using correct Railway URL
3. Check Railway logs for errors

---

## 📊 What You Get (FREE)

- **Railway:** 500 hours/month
- **MongoDB Atlas:** 512 MB storage
- **WebSockets:** Real-time price updates
- **HTTPS:** Automatic SSL
- **Auto-Deploy:** On every git push

---

## 🎯 Keep Your App Alive

Railway gives you 500 hours/month. To maximize uptime:

1. Go to https://uptimerobot.com (free)
2. Create monitor for your Railway URL
3. Ping every 5 minutes
4. Keeps your app responsive!

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **MongoDB Docs:** https://docs.atlas.mongodb.com
- **Check Logs:** Railway Dashboard → Deployments → View Logs

---

## 🎉 Success!

Your backend is live at: `https://your-app.up.railway.app`

Now update your client URLs and test the full app! 🚀
