# Deployment Configuration Files

This project includes configuration files for deploying to free hosting platforms.

## Files

- **`nixpacks.toml`** - Railway.app configuration (Nixpacks build system)
- **`glitch.json`** - Glitch.com configuration
- **`RAILWAY_DEPLOY.md`** - Quick start guide for Railway deployment

## Recommended: Railway.app

Railway.app is the recommended platform because:
- ✅ No credit card required
- ✅ 500 hours/month free
- ✅ Full WebSocket support
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration

## Quick Deploy to Railway

1. **Setup MongoDB Atlas** (free database)
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create M0 FREE cluster
   - Get connection string

2. **Deploy to Railway**
   - Go to https://railway.app
   - Sign in with GitHub
   - Deploy from this repository
   - Add environment variables:
     - `MONGODB_URI` - Your MongoDB connection string
     - `PORT` - `3000`
     - `NODE_ENV` - `production`

3. **Get your URL**
   - Generate domain in Railway settings
   - Update client URLs in your React Native app

See `RAILWAY_DEPLOY.md` for detailed step-by-step instructions.

## Configuration Details

### nixpacks.toml

Configures Railway's Nixpacks build system:
- Installs Node.js 20 and npm
- Runs `npm install` in server directory
- Starts server with `node index.js`

### glitch.json

Configures Glitch.com deployment:
- Specifies install and start commands
- Ignores client directory during watch

## Environment Variables Required

All platforms need these environment variables:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cryptotracker?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
```

## Support

For deployment issues:
- **Railway:** https://docs.railway.app
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
