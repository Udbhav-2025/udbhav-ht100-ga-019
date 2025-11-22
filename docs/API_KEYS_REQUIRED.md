# 🔑 Required API Keys and Environment Variables

This document lists all the API keys and environment variables required to run the application.

---

## 📋 Complete List of Required API Keys

### 1. **Firebase Configuration** (Required for Authentication)

These are obtained from your Firebase project console (https://console.firebase.google.com/).

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**How to get:**
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Click on the web app (or create one)
4. Copy the config values

---

### 2. **Firebase Admin SDK** (Required for Server-Side Authentication)

This is a service account key for server-side token verification.

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**How to get:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Copy the entire JSON content as a single-line string (or use a JSON minifier)

**Note:** This should be stored as a single-line JSON string in your `.env` file.

---

### 3. **MongoDB Connection** (Required for Database)

```env
MONGODB_URI=mongodb://localhost:27017/agentic-marketer
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agentic-marketer
```

**How to get:**
- **Local:** Use `mongodb://localhost:27017/agentic-marketer` if running MongoDB locally
- **Atlas:** Get connection string from MongoDB Atlas → Connect → Connect your application

---

### 4. **LLM Provider** (Required for Content Generation)

Choose ONE of the following:

#### Option A: Google Gemini (Default)
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
```

**How to get:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

#### Option B: OpenAI
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your_openai_api_key
```

**How to get:**
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy the key

#### Option C: Anthropic Claude
```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your_anthropic_api_key
```

**How to get:**
1. Go to https://console.anthropic.com/
2. Navigate to API Keys
3. Create a new key
4. Copy the key

---

### 5. **Stability AI** (Required for Image Generation)

```env
STABILITY_API_KEY=sk-your_stability_api_key
```

**How to get:**
1. Go to https://platform.stability.ai/
2. Sign up / Log in
3. Go to Account → API Keys
4. Create a new API key
5. Copy the key

---

## 📝 Complete `.env` File Template

Create a `.env` file in the root directory with all these variables:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (Service Account)
FIREBASE_SERVICE_ACCOUNT_KEY=

# Database
MONGODB_URI=

# LLM Provider (choose one)
LLM_PROVIDER=gemini
GEMINI_API_KEY=
# OR
# LLM_PROVIDER=openai
# OPENAI_API_KEY=
# OR
# LLM_PROVIDER=anthropic
# ANTHROPIC_API_KEY=

# Image Generation
STABILITY_API_KEY=
```

---

## 🔒 Security Notes

1. **Never commit `.env` file to git** - It's already in `.gitignore`
2. **Firebase Service Account Key** - Keep this extremely secure, it has admin access
3. **API Keys** - Rotate keys regularly if exposed
4. **Environment Variables** - Use different keys for development and production

---

## ✅ Quick Setup Checklist

- [ ] Create Firebase project and get client config
- [ ] Generate Firebase service account key
- [ ] Set up MongoDB (local or Atlas)
- [ ] Choose LLM provider and get API key
- [ ] Get Stability AI API key
- [ ] Create `.env` file with all variables
- [ ] Test authentication (login/signup)
- [ ] Test campaign creation
- [ ] Verify image generation works

---

## 🆘 Troubleshooting

### Authentication not working?
- Check Firebase config variables start with `NEXT_PUBLIC_`
- Verify Firebase project has Authentication enabled
- Check browser console for errors

### API routes returning 401?
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly
- Check that the service account JSON is valid
- Ensure Firebase Admin SDK is initialized

### Image generation failing?
- Verify `STABILITY_API_KEY` is set
- Check API key has sufficient credits
- Review Stability AI dashboard for errors

### LLM not working?
- Verify `LLM_PROVIDER` matches the API key you're using
- Check API key is valid and has credits
- Review provider-specific rate limits

---

**Last Updated:** $(date)

