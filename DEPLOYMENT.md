# Deployment Guide - Cryptocurrency Portfolio Tracker

This guide will help you deploy your cryptocurrency portfolio tracker backend to **Render** (free hosting) and configure it with **MongoDB Atlas** (free tier).

## Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Render account (free, no credit card required)

---

## Part 1: Setup MongoDB Atlas (Free Tier)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select a cloud provider and region (choose one closest to you)
4. Click **"Create Cluster"** (this takes 3-5 minutes)

### Step 3: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `cryptouser` (or your choice)
5. Set a strong password and **SAVE IT** (you'll need this later)
6. Set **"Built-in Role"** to **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Addresses

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render deployment)
4. This adds `0.0.0.0/0` - click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://cryptouser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/cryptotracker`
   
   Final format:
   ```
   mongodb+srv://cryptouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptotracker?retryWrites=true&w=majority
   ```

**SAVE THIS CONNECTION STRING** - you'll need it for Render!

---

## Part 2: Deploy Backend to Render

### Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   cd c:\Users\Sayed\Desktop\crypto
   git init
   git add .
   git commit -m "Initial commit - Crypto Portfolio Tracker"
   ```

2. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com/new)
   - Name it: `crypto-portfolio-tracker`
   - Make it **Public**
   - Don't initialize with README (we already have code)
   - Click **"Create repository"**

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/crypto-portfolio-tracker.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Render Account

1. Go to [Render](https://render.com)
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (easiest option)
4. Authorize Render to access your repositories

### Step 3: Deploy Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `crypto-portfolio-tracker`
3. Configure the service:
   - **Name**: `crypto-tracker-api` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**

4. Click **"Advanced"** and add environment variables:
   - Click **"Add Environment Variable"**
   - Add these variables:
     
     | Key | Value |
     |-----|-------|
     | `PORT` | `3000` |
     | `MONGODB_URI` | Your MongoDB Atlas connection string from Part 1 |
     | `NODE_ENV` | `production` |

5. Click **"Create Web Service"**

### Step 4: Wait for Deployment

- Render will build and deploy your app (takes 3-5 minutes)
- Watch the logs for any errors
- Once you see **"Your service is live 🎉"**, it's ready!

### Step 5: Get Your API URL

- Your API will be available at: `https://crypto-tracker-api.onrender.com`
- Test it by visiting: `https://crypto-tracker-api.onrender.com/api/exchanges`
- You should see JSON response with exchange list

---

## Part 3: Configure React Native Client

### Update API URLs

1. Open `client/src/api/socket.js`
2. Update the URL:
   ```javascript
   const SOCKET_URL = 'https://crypto-tracker-api.onrender.com';
   ```

3. Open `client/src/api/api.js`
4. Update the URL:
   ```javascript
   const API_URL = 'https://crypto-tracker-api.onrender.com/api';
   ```

### Test the App

1. Start the React Native app:
   ```bash
   cd client
   npm run android
   # or
   npm run ios
   ```

2. The app should now connect to your live backend!

---

## Part 4: Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ Automatic HTTPS
- ✅ WebSocket support
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds

**MongoDB Atlas Free Tier:**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Sufficient for development/testing

### Cold Start Issue

When your Render service spins down due to inactivity:
- First request after inactivity takes 30-60 seconds
- Subsequent requests are fast
- Your mobile app may show "loading" for longer on first launch

**Solution**: Use a service like [UptimeRobot](https://uptimerobot.com/) (free) to ping your API every 5 minutes to keep it alive.

### Monitoring Your Deployment

1. **Render Dashboard**: Monitor logs, metrics, and deployment status
2. **MongoDB Atlas**: Monitor database usage and connections
3. **Test Endpoints**:
   - Health check: `https://YOUR-APP.onrender.com/api/exchanges`
   - Portfolio: `https://YOUR-APP.onrender.com/api/portfolio`
   - Alerts: `https://YOUR-APP.onrender.com/api/alerts`

---

## Part 5: Troubleshooting

### Issue: App can't connect to server

**Solution:**
1. Check Render logs for errors
2. Verify MongoDB connection string is correct
3. Ensure MongoDB IP whitelist includes `0.0.0.0/0`
4. Check that client URLs are updated correctly

### Issue: WebSocket connection fails

**Solution:**
1. Render free tier supports WebSockets
2. Ensure you're using `https://` not `http://`
3. Check browser console for CORS errors

### Issue: Database connection errors

**Solution:**
1. Verify MongoDB Atlas user credentials
2. Check network access settings (IP whitelist)
3. Ensure connection string includes database name

### Issue: Cold start is too slow

**Solution:**
1. Use UptimeRobot to keep service alive
2. Consider upgrading to paid tier ($7/month) for always-on service

---

## Part 6: Next Steps

### Optional Enhancements

1. **Custom Domain**: Add your own domain in Render settings
2. **CI/CD**: Automatic deployments on git push (already configured!)
3. **Monitoring**: Add error tracking with Sentry
4. **Analytics**: Track API usage with LogRocket or similar

### Scaling Up

When you're ready to scale:
1. Upgrade Render to paid tier ($7/month) for:
   - Always-on service
   - More RAM/CPU
   - Faster builds
2. Upgrade MongoDB Atlas for more storage

---

## Support

For issues:
- **Render**: [Render Docs](https://render.com/docs)
- **MongoDB Atlas**: [MongoDB Docs](https://docs.atlas.mongodb.com/)
- **App Issues**: Check server logs in Render dashboard

---

## Summary

✅ **Backend**: Deployed to Render (free)  
✅ **Database**: MongoDB Atlas (free)  
✅ **WebSockets**: Fully supported  
✅ **HTTPS**: Automatic SSL  
✅ **Cost**: $0/month  

Your cryptocurrency portfolio tracker is now live and accessible from anywhere! 🚀
