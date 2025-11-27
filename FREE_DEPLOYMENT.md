# Free Deployment Guide - Cryptocurrency Portfolio Tracker

This guide provides **100% FREE** deployment options that **DO NOT require a credit card**. Choose the platform that works best for you.

---

## 🎯 Quick Comparison

| Platform | Free Tier | Credit Card Required? | WebSocket Support | Best For |
|----------|-----------|----------------------|-------------------|----------|
| **Railway.app** | 500 hours/month | ❌ NO | ✅ Yes | Best overall option |
| **Glitch.com** | Always-on | ❌ NO | ✅ Yes | Easiest setup |
| **Cyclic.sh** | Unlimited | ❌ NO | ⚠️ Limited | Simple APIs |

---

## Option 1: Railway.app (RECOMMENDED) 🚂

**Why Railway?**
- ✅ No credit card required
- ✅ 500 hours/month free (enough for 24/7 with one app)
- ✅ Full WebSocket support
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Environment variables
- ✅ MongoDB Atlas compatible

### Step 1: Setup MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a **FREE M0 Cluster**
4. Create database user:
   - Username: `cryptouser`
   - Password: (create a strong password and save it)
5. Network Access: Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   ```
   mongodb+srv://cryptouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptotracker?retryWrites=true&w=majority
   ```
   **SAVE THIS!**

### Step 2: Push Code to GitHub

```bash
cd c:\Users\Sayed\Desktop\crypto
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 3: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with **GitHub** (no credit card needed!)
4. Click **"Deploy from GitHub repo"**
5. Select your `crypto-portfolio-tracker` repository
6. Railway will detect it's a Node.js app
7. Click **"Add variables"** and add:
   - `MONGODB_URI` = Your MongoDB connection string
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
8. Click **"Deploy"**

### Step 4: Configure Root Directory

Railway might try to deploy from root. We need to deploy from `/server`:

1. In Railway dashboard, click on your service
2. Go to **Settings** tab
3. Find **"Root Directory"**
4. Set it to: `server`
5. Click **"Save"**
6. Railway will automatically redeploy

### Step 5: Get Your URL

1. In Railway dashboard, go to **Settings**
2. Click **"Generate Domain"**
3. You'll get a URL like: `https://your-app.up.railway.app`
4. **SAVE THIS URL!**

### Step 6: Test Your Deployment

Visit these URLs to test:
- `https://your-app.up.railway.app/api/exchanges` - Should return exchange list
- `https://your-app.up.railway.app/api/portfolio` - Should return empty array or portfolio data

---

## Option 2: Glitch.com (EASIEST) ✨

**Why Glitch?**
- ✅ No credit card required
- ✅ Always-on (with Glitch Pro features available free)
- ✅ WebSocket support
- ✅ Live code editor
- ✅ Instant deployment
- ⚠️ Limited to 4000 requests/hour

### Step 1: Setup MongoDB Atlas

Follow the same MongoDB Atlas setup from Option 1 above.

### Step 2: Create Glitch Project

1. Go to [Glitch.com](https://glitch.com)
2. Click **"Sign in"** → Use GitHub
3. Click **"New Project"** → **"Import from GitHub"**
4. Enter your repo URL: `https://github.com/YOUR_USERNAME/crypto-portfolio-tracker`
5. Wait for import to complete

### Step 3: Configure Project

1. Click on **`.env`** file in the sidebar
2. Add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://cryptouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cryptotracker
   PORT=3000
   NODE_ENV=production
   ```

### Step 4: Update glitch.json

Create a file called `glitch.json` in the root:

```json
{
  "install": "cd server && npm install",
  "start": "cd server && node index.js",
  "watch": {
    "ignore": [
      "client/**"
    ]
  }
}
```

### Step 5: Get Your URL

Your app will be live at: `https://your-project-name.glitch.me`

Test it:
- `https://your-project-name.glitch.me/api/exchanges`

---

## Option 3: Cyclic.sh (SIMPLE) 🔄

**Why Cyclic?**
- ✅ No credit card required
- ✅ Unlimited deployments
- ✅ Serverless (auto-scales)
- ⚠️ Limited WebSocket support (may need polling instead)

### Step 1: Deploy to Cyclic

1. Go to [Cyclic.sh](https://www.cyclic.sh)
2. Click **"Connect GitHub"**
3. Select your repository
4. Cyclic auto-detects Node.js
5. Add environment variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `PORT` = `3000`
6. Click **"Connect"**

### Step 2: Configure for Server Directory

In Cyclic dashboard:
1. Go to **Settings**
2. Set **"Root Directory"** to `server`
3. Save and redeploy

---

## 📱 Update React Native Client

After deploying to any platform, update your client:

### Update API URLs

1. Open `client/src/api/socket.js`:
   ```javascript
   const SOCKET_URL = 'https://YOUR-DEPLOYED-URL';
   ```

2. Open `client/src/api/api.js`:
   ```javascript
   const API_URL = 'https://YOUR-DEPLOYED-URL/api';
   ```

Replace `YOUR-DEPLOYED-URL` with:
- Railway: `https://your-app.up.railway.app`
- Glitch: `https://your-project-name.glitch.me`
- Cyclic: `https://your-app.cyclic.app`

### Test the App

```bash
cd client
npm run android
# or
npm run ios
```

---

## 🎯 My Recommendation

**Use Railway.app** because:
1. ✅ No credit card needed
2. ✅ Best free tier (500 hours/month)
3. ✅ Full WebSocket support
4. ✅ Professional deployment
5. ✅ Easy GitHub integration
6. ✅ Great for portfolio projects

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
1. Check Railway/Glitch logs for errors
2. Verify MongoDB connection string is correct
3. Ensure MongoDB allows connections from anywhere (0.0.0.0/0)
4. Check that environment variables are set correctly

### Issue: "WebSocket connection failed"

**Solution:**
1. Ensure you're using `https://` not `http://`
2. Railway and Glitch both support WebSockets
3. Check CORS settings in server code

### Issue: "App sleeps/spins down"

**Railway:** Uses 500 hours/month, stays active if under limit
**Glitch:** Sleeps after 5 minutes of inactivity (wakes up automatically)
**Solution:** Use [UptimeRobot](https://uptimerobot.com) (free) to ping your API every 5 minutes

---

## 📊 Free Tier Limits

### Railway.app
- 500 hours/month (≈ 20 days of 24/7 operation)
- 512 MB RAM
- 1 GB disk
- Shared CPU

### Glitch.com
- 4000 requests/hour
- 512 MB RAM
- 200 MB disk
- Sleeps after 5 min inactivity

### MongoDB Atlas
- 512 MB storage
- Shared cluster
- Perfect for development

---

## 🚀 Next Steps

1. ✅ Choose a platform (I recommend Railway)
2. ✅ Setup MongoDB Atlas
3. ✅ Deploy your backend
4. ✅ Update client URLs
5. ✅ Test your app
6. ✅ Share your portfolio project!

---

## 💡 Pro Tips

1. **Keep it alive:** Use UptimeRobot to ping your API every 5 minutes
2. **Monitor usage:** Check Railway dashboard to track your 500 hours
3. **Environment variables:** Never commit secrets to GitHub
4. **Logs:** Use platform dashboards to monitor errors
5. **Custom domain:** Railway allows custom domains for free!

---

## 📞 Support

- **Railway:** [Railway Docs](https://docs.railway.app)
- **Glitch:** [Glitch Help](https://help.glitch.com)
- **MongoDB:** [MongoDB Docs](https://docs.atlas.mongodb.com)

---

## ✅ Summary

You now have **THREE** completely free options to deploy your crypto tracker:

1. 🚂 **Railway.app** - Best overall (RECOMMENDED)
2. ✨ **Glitch.com** - Easiest setup
3. 🔄 **Cyclic.sh** - Simple serverless

**All require $0 and NO credit card!** 🎉

Choose one and get your app live in minutes!
