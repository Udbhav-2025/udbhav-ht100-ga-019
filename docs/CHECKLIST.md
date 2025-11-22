# ✅ Getting Started Checklist

Use this checklist to set up and run The Agentic Marketer application.

## 📋 Prerequisites

### Required
- [ ] **Node.js 18+** installed
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **MongoDB** (choose one):
  - [ ] **Option A:** Local MongoDB installed and running
    - Download: https://www.mongodb.com/try/download/community
    - Start: `mongod`
  - [ ] **Option B:** MongoDB Atlas (cloud)
    - Sign up: https://www.mongodb.com/cloud/atlas
    - Create free cluster
    - Get connection string

- [ ] **API Keys** (get at least one LLM provider):
  - [ ] OpenAI API Key: https://platform.openai.com/api-keys
    - OR
  - [ ] Anthropic API Key: https://console.anthropic.com/
  
  - [ ] **Optional:** Stability AI API Key: https://platform.stability.ai/
    - ⚠️ Without this, placeholder images will be used

---

## 🔧 Setup Steps

### Step 1: Install Dependencies
```powershell
# Navigate to project directory
cd d:\Adflow

# Install all packages
npm install
```
- [ ] Dependencies installed successfully
- [ ] No error messages

### Step 2: Configure Environment
```powershell
# Copy environment template
cp .env.example .env

# Edit with your favorite editor
notepad .env
# or
code .env
```

**Required Environment Variables:**
- [ ] `MONGODB_URI` - Your MongoDB connection string
  ```
  # Local:
  MONGODB_URI=mongodb://localhost:27017/agentic-marketer
  
  # Or Atlas:
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agentic-marketer
  ```

- [ ] Choose LLM Provider (set ONE of these):
  - [ ] `OPENAI_API_KEY=sk-...` (for GPT-4o)
  - [ ] `ANTHROPIC_API_KEY=sk-ant-...` (for Claude 3.5)

- [ ] `LLM_PROVIDER` - Set to "openai" or "anthropic"
  ```
  LLM_PROVIDER=openai
  ```

- [ ] **Optional:** `STABILITY_API_KEY=sk-...` (for image generation)

### Step 3: Validate Configuration
```powershell
# Run environment check
npm run check
```
- [ ] All checks passed ✅
- [ ] MongoDB connection OK
- [ ] LLM provider configured
- [ ] No blocking errors

---

## 🚀 Launch Application

### Step 1: Start MongoDB (if local)
```powershell
# In a separate terminal
mongod
```
- [ ] MongoDB running (or using Atlas)

### Step 2: Start Development Server
```powershell
npm run dev
```
- [ ] Server started successfully
- [ ] No error messages
- [ ] Console shows: "✅ MongoDB connected"

### Step 3: Open Browser
```
http://localhost:3000
```
- [ ] Landing page loads
- [ ] Animated background visible
- [ ] "Start a Campaign" button present

---

## 🧪 Test Your First Campaign

### Create Campaign
1. - [ ] Click "Start a Campaign"
2. - [ ] Enter test URL: `https://stripe.com`
3. - [ ] Select platforms:
   - [ ] Instagram
   - [ ] LinkedIn
   - [ ] Twitter/X
4. - [ ] Choose tone: "Professional"
5. - [ ] Select goal: "Awareness"
6. - [ ] Click "Create Campaign"

### Monitor Progress
- [ ] Redirected to status page
- [ ] Progress indicator shows current step
- [ ] Steps animate as they complete:
  - [ ] Researching brand
  - [ ] Generating content
  - [ ] Generating images
  - [ ] Self-critique & refinement
  - [ ] Completed

### Review Results
- [ ] Results page loads automatically
- [ ] Brand summary displayed
- [ ] Platform tabs work (Instagram, LinkedIn, Twitter)
- [ ] Content visible for each platform
- [ ] Images displayed (or placeholders)
- [ ] AI critique panel visible
- [ ] Copy buttons work
- [ ] Download buttons work (for images)

### Test Regeneration
- [ ] Click "Regenerate" button
- [ ] Try different tone (e.g., "Playful")
- [ ] Content updates with new tone

---

## 🔍 Troubleshooting

### MongoDB Issues
**Problem:** Cannot connect to MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions:**
- [ ] Start MongoDB: `mongod`
- [ ] Check MONGODB_URI in .env
- [ ] Try MongoDB Atlas instead

### API Key Issues
**Problem:** No LLM provider configured
```
Error: No LLM provider configured
```
**Solutions:**
- [ ] Verify .env file exists
- [ ] Check API key format (starts with 'sk-')
- [ ] Confirm LLM_PROVIDER matches your key
- [ ] Restart server after .env changes

### Port Already in Use
**Problem:** Port 3000 is already in use
**Solutions:**
```powershell
# Option 1: Kill existing process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Option 2: Use different port
npm run dev -- -p 3001
```

### Image Generation Fails
**Problem:** Images not generating
**Solutions:**
- [ ] Check STABILITY_API_KEY is valid
- [ ] Verify API credit balance
- [ ] App will use placeholders automatically

### Scraping Fails
**Problem:** Cannot scrape website
**Possible causes:**
- [ ] URL is incorrect or inaccessible
- [ ] Website blocks scrapers
- [ ] Network/firewall issues

**Solutions:**
- [ ] Try different URL (e.g., stripe.com, vercel.com)
- [ ] Check internet connection
- [ ] Use public, accessible websites

---

## 📊 Verify Everything Works

### Frontend Checks
- [ ] Landing page loads and looks professional
- [ ] Animated background is smooth (no lag)
- [ ] Navigation works
- [ ] Form validation works
- [ ] Toast notifications appear
- [ ] Responsive design works on mobile

### Backend Checks
- [ ] API endpoints respond
  ```powershell
  # Test health
  curl http://localhost:3000/api/campaigns
  ```
- [ ] Database connection stable
- [ ] No console errors

### AI Integration Checks
- [ ] LLM generates content (check terminal logs)
- [ ] Content is relevant and high-quality
- [ ] Images generate (or placeholders work)
- [ ] Critique system provides feedback

---

## 🎯 Success Criteria

**Your setup is complete when:**
- [ ] ✅ All environment checks pass
- [ ] ✅ MongoDB connects successfully
- [ ] ✅ Development server runs without errors
- [ ] ✅ Landing page loads in browser
- [ ] ✅ Can create a test campaign
- [ ] ✅ Campaign completes successfully
- [ ] ✅ Results display correctly
- [ ] ✅ All features work as expected

---

## 📚 Next Steps

Once everything is working:

### Explore Features
- [ ] Try different websites
- [ ] Test various tone/goal combinations
- [ ] Experiment with platform selections
- [ ] Use regeneration feature
- [ ] Review AI critique feedback

### Read Documentation
- [ ] README.md - Project overview
- [ ] QUICKSTART.md - Quick setup
- [ ] DEVELOPMENT.md - Technical details
- [ ] PROJECT_OVERVIEW.md - Architecture

### Customize
- [ ] Modify UI colors (tailwind.config.js)
- [ ] Add new platforms
- [ ] Enhance prompts (llm.service.ts)
- [ ] Add analytics

### Deploy
- [ ] Build production version: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Deploy to Vercel/Netlify/Railway
- [ ] Configure production environment variables

---

## 🆘 Need Help?

### Resources
- [ ] Check terminal logs for errors
- [ ] Review QUICKSTART.md
- [ ] Read DEVELOPMENT.md troubleshooting section
- [ ] Verify all environment variables
- [ ] Ensure MongoDB is accessible

### Common Questions

**Q: How long should a campaign take?**
A: 2-4 minutes typically (depends on API speed)

**Q: Can I use without image generation?**
A: Yes! Placeholders will be used automatically

**Q: Which LLM is better?**
A: Both GPT-4o and Claude 3.5 work well. Try both!

**Q: How much do the APIs cost?**
A: Varies by provider. Expect ~$0.50-2.00 per campaign

**Q: Can I run without API keys?**
A: No, at least one LLM provider key is required

---

## ✨ You're Ready!

Once all boxes are checked, you have a fully functional AI marketing assistant!

**Happy campaigning! 🚀**

---

Last Updated: 2025-01-15
Version: 1.0.0
