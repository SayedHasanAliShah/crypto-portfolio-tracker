# 📊 Cryptocurrency Portfolio Tracker

A full-stack **React Native** mobile application for tracking cryptocurrency portfolios with **real-time price updates**, portfolio valuation, market trend analysis, and price alerts. Built with Node.js backend, MongoDB database, and WebSocket integration for live data streaming.

[![Live Backend](https://img.shields.io/badge/Backend-Live-success)](https://crypto-tracker-api-production.up.railway.app)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)](#)
[![License](https://img.shields.io/badge/License-ISC-green)](#)

---

## 🌟 Features

### 📱 Mobile App (React Native)
- ✅ **Real-time Price Updates** - Live cryptocurrency prices via WebSocket
- ✅ **Portfolio Management** - Add, track, and manage your crypto holdings
- ✅ **Price Alerts** - Set custom price alerts for any cryptocurrency
- ✅ **Market Trends** - View price changes and market trends
- ✅ **Multi-Exchange Support** - Track prices across multiple exchanges
- ✅ **Responsive UI** - Clean, modern interface for iOS and Android
- ✅ **Persistent Storage** - MongoDB backend for data persistence

### 🚀 Backend (Node.js + Express)
- ✅ **RESTful API** - Portfolio and alert management endpoints
- ✅ **WebSocket Server** - Real-time price streaming with Socket.IO
- ✅ **MongoDB Integration** - Persistent data storage
- ✅ **CORS Enabled** - Cross-origin resource sharing for mobile apps
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Production Ready** - Deployed on Railway.app with automatic HTTPS

---

## 🏗️ Architecture

```
crypto-portfolio-tracker/
├── client/                    # React Native mobile app
│   ├── src/
│   │   ├── api/              # API and WebSocket services
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens
│   │   └── utils/            # Utility functions
│   ├── android/              # Android native code
│   ├── ios/                  # iOS native code
│   └── package.json          # Client dependencies
│
├── server/                   # Node.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── index.js             # Server entry point
│   └── package.json         # Server dependencies
│
├── package.json             # Root package (Railway deployment)
├── glitch.json              # Glitch.com deployment config
└── README.md                # This file
```

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework:** React Native CLI
- **Language:** JavaScript
- **State Management:** React Hooks
- **HTTP Client:** Axios
- **WebSocket:** Socket.IO Client
- **Platforms:** iOS & Android

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **WebSocket:** Socket.IO
- **HTTP Client:** Axios
- **Environment:** dotenv

### Deployment
- **Backend Hosting:** Railway.app (Free Tier)
- **Database:** MongoDB Atlas (Free M0 Cluster)
- **SSL/HTTPS:** Automatic (Railway)
- **CI/CD:** Auto-deploy on git push

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)
- MongoDB Atlas account (free)

### 1. Clone the Repository

```bash
git clone https://github.com/SayedHasanAliShah/crypto-portfolio-tracker.git
cd crypto-portfolio-tracker
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Setup Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/cryptotracker
PORT=3000
NODE_ENV=development
```

---

## 🚀 Running Locally

### Start the Backend Server

```bash
cd server
npm start
```

Server will run on `http://localhost:3000`

### Start the Mobile App

**For Android:**
```bash
cd client
npm run android
```

**For iOS:**
```bash
cd client
npm run ios
```

### Update Local API URLs

If running locally, update these files:

**`client/src/api/socket.js`:**
```javascript
const SOCKET_URL = 'http://YOUR_LOCAL_IP:3000';
```

**`client/src/api/api.js`:**
```javascript
const API_URL = 'http://YOUR_LOCAL_IP:3000/api';
```

Replace `YOUR_LOCAL_IP` with your machine's local IP address (not localhost).

---

## 🌐 Deployment

### Backend Deployment (Railway.app)

The backend is deployed on **Railway.app** - a free hosting platform that doesn't require a credit card.

**Live Backend URL:**
```
https://crypto-tracker-api-production.up.railway.app
```

#### Deploy Your Own Instance

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository
   - Railway auto-detects and deploys

3. **Add Environment Variables**
   - Go to Variables tab
   - Add: `MONGODB_URI`, `PORT`, `NODE_ENV`

4. **Generate Domain**
   - Go to Settings → Networking
   - Click "Generate Domain"

For detailed deployment instructions, see [`RAILWAY_DEPLOY.md`](RAILWAY_DEPLOY.md).

### Database Setup (MongoDB Atlas)

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create M0 FREE cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string

---

## 📡 API Documentation

### Base URL
```
Production: https://crypto-tracker-api-production.up.railway.app/api
Local: http://localhost:3000/api
```

### Endpoints

#### Portfolio Management

**Get Portfolio**
```http
GET /api/portfolio
```

**Add to Portfolio**
```http
POST /api/portfolio
Content-Type: application/json

{
  "symbol": "BTC",
  "amount": 0.5,
  "exchange": "binance"
}
```

**Delete from Portfolio**
```http
DELETE /api/portfolio/:id
```

#### Price Alerts

**Get Alerts**
```http
GET /api/alerts
```

**Create Alert**
```http
POST /api/alerts
Content-Type: application/json

{
  "symbol": "ETH",
  "targetPrice": 2000,
  "condition": "above"
}
```

**Delete Alert**
```http
DELETE /api/alerts/:id
```

**Update Alert**
```http
PATCH /api/alerts/:id
Content-Type: application/json

{
  "isActive": false
}
```

#### Exchanges

**Get Supported Exchanges**
```http
GET /api/exchanges
```

### WebSocket Events

**Connect to WebSocket**
```javascript
import io from 'socket.io-client';
const socket = io('https://crypto-tracker-api-production.up.railway.app');
```

**Listen for Price Updates**
```javascript
socket.on('price_update', (prices) => {
  console.log('Latest prices:', prices);
});
```

---

## 🎨 Screenshots

> Add screenshots of your app here

---

## 🔧 Configuration

### Client Configuration

**API URLs** (`client/src/api/`)
- `socket.js` - WebSocket connection URL
- `api.js` - REST API base URL

**App Configuration** (`client/app.json`)
- App name and display settings

### Server Configuration

**Environment Variables** (`.env`)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

**Deployment** (`package.json` root)
- Install script: `cd server && npm install`
- Start script: `cd server && npm start`

---

## 📊 Database Schema

### Portfolio Collection
```javascript
{
  symbol: String,      // Cryptocurrency symbol (BTC, ETH, etc.)
  amount: Number,      // Amount owned
  exchange: String,    // Exchange name
  createdAt: Date
}
```

### Alerts Collection
```javascript
{
  symbol: String,      // Cryptocurrency symbol
  targetPrice: Number, // Target price for alert
  condition: String,   // 'above' or 'below'
  isActive: Boolean,   // Alert status
  createdAt: Date
}
```

---

## 🧪 Testing

### Test Backend Endpoints

**Check if backend is running:**
```bash
curl https://crypto-tracker-api-production.up.railway.app/api/exchanges
```

**Test portfolio endpoint:**
```bash
curl https://crypto-tracker-api-production.up.railway.app/api/portfolio
```

### Test Mobile App

1. Start the app on emulator/device
2. Verify price updates are loading
3. Test adding coins to portfolio
4. Test creating price alerts
5. Verify real-time updates work

---

## 🐛 Troubleshooting

### Common Issues

**App can't connect to backend**
- Check that backend URL is correct in `socket.js` and `api.js`
- Verify backend is running (visit API URL in browser)
- Check network connectivity

**WebSocket connection fails**
- Ensure using `https://` for production URLs
- Check CORS settings in server
- Verify Railway deployment is successful

**Build errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Metro bundler cache: `npm start -- --reset-cache`
- For Android: `cd android && ./gradlew clean`

**MongoDB connection errors**
- Verify connection string is correct
- Check MongoDB Atlas network access (whitelist 0.0.0.0/0)
- Ensure database user has correct permissions

For more troubleshooting, see [`RAILWAY_FIX.md`](RAILWAY_FIX.md).

---

## 📈 Performance

### Free Tier Limits

**Railway.app**
- 500 hours/month (≈ 20 days of 24/7 operation)
- 512 MB RAM
- 1 GB storage
- Shared CPU

**MongoDB Atlas**
- 512 MB storage
- Shared cluster
- Sufficient for development/testing

### Optimization Tips

1. **Keep Backend Alive**
   - Use [UptimeRobot](https://uptimerobot.com) to ping API every 5 minutes
   - Prevents cold starts on Railway

2. **Reduce API Calls**
   - Use WebSocket for real-time data
   - Cache responses when appropriate

3. **Optimize Database Queries**
   - Add indexes for frequently queried fields
   - Use projection to limit returned fields

---

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ CORS configured for mobile app access
- ✅ HTTPS/SSL automatic on Railway
- ✅ MongoDB connection string not committed to git
- ✅ Input validation on API endpoints

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Sayed Hasan Ali Shah**

- GitHub: [@SayedHasanAliShah](https://github.com/SayedHasanAliShah)

---

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) - Cryptocurrency price data
- [Railway.app](https://railway.app) - Free backend hosting
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free database hosting
- [Socket.IO](https://socket.io) - Real-time WebSocket communication
- [React Native](https://reactnative.dev) - Mobile app framework

---

## 📚 Additional Documentation

- [`RAILWAY_DEPLOY.md`](RAILWAY_DEPLOY.md) - Quick deployment guide
- [`RAILWAY_FIX.md`](RAILWAY_FIX.md) - Deployment troubleshooting
- [`glitch.json`](glitch.json) - Alternative deployment (Glitch.com)

---

## 🎯 Roadmap

Future enhancements planned:
- [ ] User authentication and multi-user support
- [ ] Historical price charts
- [ ] Push notifications for price alerts
- [ ] Portfolio performance analytics
- [ ] Support for more cryptocurrencies
- [ ] Dark mode theme
- [ ] Export portfolio data
- [ ] Multi-currency support (USD, EUR, etc.)

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [`RAILWAY_FIX.md`](RAILWAY_FIX.md) for deployment issues
3. Open an issue on GitHub
4. Check Railway logs for backend errors
5. Check MongoDB Atlas for database issues

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ using React Native, Node.js, and MongoDB**

🚀 **Live Demo:** [https://crypto-tracker-api-production.up.railway.app](https://crypto-tracker-api-production.up.railway.app)
