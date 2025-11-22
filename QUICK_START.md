# 🚀 Quick Start Guide

Your application is fully configured! Follow these steps to get started.

## ✅ What's Ready

- ✅ Firebase Authentication (Project: adflow-3847a)
- ✅ Gemini API for content generation
- ✅ Stability AI for image generation
- ✅ All code implemented and ready

## 📝 Setup Steps

### 1. Create `.env.local` File

Create `.env.local` in the root directory. See `docs/COMPLETE_ENV_SETUP.md` for the complete file content with all your API keys.

**Quick copy:**
```bash
# Copy the content from docs/COMPLETE_ENV_SETUP.md
# Or use this template (all keys included):
```

### 2. Enable Firebase Email/Password Auth

1. Go to https://console.firebase.google.com/
2. Select project: **adflow-3847a**
3. Click **Authentication** → **Sign-in method**
4. Click **Email/Password**
5. **Enable** it
6. Click **Save**

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally, then use:
MONGODB_URI=mongodb://localhost:27017/agentic-marketer
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Add to `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agentic-marketer
```

### 4. Install Dependencies & Run

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

### 5. Test the Application

1. Open http://localhost:3000
2. Click **Sign In**
3. Click **Sign up** to create account
4. After signup, you'll be redirected to Dashboard
5. Click **New Campaign** to create your first campaign!

## 🎯 What You Can Do

- ✅ Sign up / Sign in with email & password
- ✅ Create marketing campaigns
- ✅ View campaign timeline on dashboard
- ✅ Generate AI content for Instagram, LinkedIn, Twitter
- ✅ Generate images with text overlays
- ✅ View campaign results and critique

## 📚 Documentation

- `docs/COMPLETE_ENV_SETUP.md` - Complete environment setup with all keys
- `docs/FIREBASE_SETUP.md` - Firebase-specific setup
- `docs/API_KEYS_REQUIRED.md` - Detailed API key documentation

## ✅ Checklist

- [ ] Create `.env.local` file with all keys
- [ ] Enable Email/Password auth in Firebase Console
- [ ] Set up MongoDB (local or Atlas)
- [ ] Run `npm install` (if needed)
- [ ] Run `npm run dev`
- [ ] Test signup/login
- [ ] Create a test campaign

---

**Ready to go!** Just create the `.env.local` file and enable Firebase auth.

