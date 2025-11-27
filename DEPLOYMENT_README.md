# Crypto Portfolio Tracker - Deployment Files

This directory contains configuration files for various free deployment platforms.

## Files

- `FREE_DEPLOYMENT.md` - Comprehensive guide for deploying to free platforms (Railway, Glitch, Cyclic)
- `DEPLOYMENT.md` - Original Render deployment guide (requires credit card)
- `railway.json` - Railway.app configuration
- `glitch.json` - Glitch.com configuration
- `render.yaml` - Render.com configuration

## Recommended Platform: Railway.app

**Why Railway?**
- ✅ No credit card required
- ✅ 500 hours/month free tier
- ✅ Full WebSocket support
- ✅ Automatic HTTPS
- ✅ GitHub integration

## Quick Start

1. Read `FREE_DEPLOYMENT.md` for detailed instructions
2. Choose your platform (Railway recommended)
3. Setup MongoDB Atlas (free)
4. Deploy your backend
5. Update client URLs
6. Test your app

## Platform URLs

After deployment, your API will be available at:
- **Railway:** `https://your-app.up.railway.app`
- **Glitch:** `https://your-project-name.glitch.me`
- **Cyclic:** `https://your-app.cyclic.app`

## Environment Variables Required

All platforms need these environment variables:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cryptotracker
PORT=3000
NODE_ENV=production
```

## Support

See `FREE_DEPLOYMENT.md` for troubleshooting and detailed setup instructions.
