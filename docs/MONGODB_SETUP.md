# MongoDB Setup Guide

## ⚠️ Important: Data Persistence

Your application is currently using an **in-memory database**, which means all data is lost when you restart the server. To persist your campaigns, you need to set up MongoDB.

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Easiest option - no installation required!**

1. **Sign up for free MongoDB Atlas account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and create an account

2. **Create a free cluster**
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Set up database access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Set up network access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get connection string**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database user password
   - Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/agentic-marketer`

6. **Add to your `.env.local` file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agentic-marketer
   ```

7. **Restart your application**
   ```bash
   npm run dev
   ```

You should see: `✅ MongoDB connected successfully`

---

### Option 2: Local MongoDB Installation

**For local development**

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow instructions at https://docs.mongodb.com/manual/installation/

2. **Start MongoDB**
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```

3. **Verify it's running**
   - Check if MongoDB is listening on port 27017
   - You should see: `✅ MongoDB connected successfully`

4. **Your `.env.local` should have:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/agentic-marketer
   ```

---

## Verify Your Setup

1. **Check database status**
   - Visit: http://localhost:3000/api/health/db
   - You should see: `"database": "mongodb"` and `"persistent": true`

2. **Check server logs**
   - When you start the app, look for:
   - `✅ MongoDB connected successfully` (good!)
   - `⚠️ WARNING: Using in-memory database` (needs setup!)

---

## Troubleshooting

### "MongoDB connection failed"
- **Check MongoDB is running** (if local)
- **Verify connection string** in `.env.local`
- **Check network access** (if using Atlas)
- **Verify username/password** are correct

### "Using in-memory database"
- MongoDB connection failed
- Check the error message in server logs
- Follow setup steps above

### Data still disappearing
- Make sure you see `✅ MongoDB connected` in logs
- Check `/api/health/db` shows `"persistent": true`
- Restart the application after setting up MongoDB

---

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Local MongoDB Docs: https://docs.mongodb.com/manual/installation/
- Check your setup: Visit http://localhost:3000/api/health/db

