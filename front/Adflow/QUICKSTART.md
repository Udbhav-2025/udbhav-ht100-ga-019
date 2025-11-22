# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- API Keys from:
  - OpenAI (https://platform.openai.com/api-keys) OR
  - Anthropic (https://console.anthropic.com/)
  - Stability AI (https://platform.stability.ai/)

## Installation Steps

### 1. Install Dependencies
```powershell
npm install
```

### 2. Set Up Environment Variables
```powershell
# Copy the example file
cp .env.example .env

# Edit .env and add your keys
notepad .env
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/agentic-marketer
OPENAI_API_KEY=sk-your-key-here          # OR use Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here   # OR use OpenAI
LLM_PROVIDER=openai                       # "openai" or "anthropic"
STABILITY_API_KEY=sk-your-key-here
```

### 3. Start MongoDB (if local)
```powershell
# Start MongoDB service
mongod
```

Or use MongoDB Atlas (cloud):
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and add to MONGODB_URI

### 4. Run Development Server
```powershell
npm run dev
```

### 5. Open Your Browser
Navigate to: http://localhost:3000

## First Campaign Test

1. Click "Start a Campaign"
2. Enter a website URL (try: https://stripe.com or https://vercel.com)
3. Select platforms: Instagram, LinkedIn, Twitter
4. Choose tone: Professional
5. Select goal: Awareness
6. Click "Create Campaign"
7. Watch the AI work through each step
8. View your generated campaign!

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB with `mongod` command

### API Key Error
```
Error: No LLM provider configured
```
**Solution:** 
- Check .env file exists
- Verify API keys are set
- Ensure LLM_PROVIDER matches your chosen provider

### Image Generation Issues
If images fail to generate:
- Check STABILITY_API_KEY is valid
- App will use placeholder images as fallback
- Check https://platform.stability.ai/account/credits for quota

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:**
```powershell
# Kill the process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use a different port
npm run dev -- -p 3001
```

## Production Build

```powershell
# Build the application
npm run build

# Start production server
npm start
```

## Testing Different Scenarios

### Test 1: Simple Website
- URL: https://example.com
- Expected: Basic campaign with generic content

### Test 2: Tech Company
- URL: https://stripe.com
- Expected: Professional, technical content

### Test 3: E-commerce
- URL: https://shopify.com
- Expected: Sales-focused, engaging content

### Test 4: Regeneration
- Create a campaign
- When complete, click "Regenerate"
- Try different tone (e.g., "Playful" instead of "Professional")

## Monitoring

Watch the terminal for logs:
- ✅ MongoDB connected
- Campaign processing steps
- API calls and responses
- Error messages

## Next Steps

1. Review generated content quality
2. Test different website URLs
3. Try various tone and goal combinations
4. Check image generation (if Stability AI configured)
5. Read DEVELOPMENT.md for technical details

## Support

For issues:
1. Check the terminal logs
2. Verify all environment variables
3. Ensure MongoDB is running
4. Confirm API keys are valid and have quota
5. Review README.md and DEVELOPMENT.md

## API Limits

Keep in mind:
- OpenAI GPT-4: Usage-based pricing
- Anthropic Claude: Token-based pricing
- Stability AI: Credit-based system
- MongoDB Atlas Free: 512MB storage

Start with test campaigns to avoid excessive API usage!
