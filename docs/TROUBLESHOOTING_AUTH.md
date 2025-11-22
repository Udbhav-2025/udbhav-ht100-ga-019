# 🔧 Troubleshooting Authentication Issues

## Common 401 Unauthorized Errors

If you're seeing `401 Unauthorized` errors when trying to access the dashboard or create campaigns, follow these steps:

### 1. Check Firebase Service Account Key

The most common issue is that `FIREBASE_SERVICE_ACCOUNT_KEY` is not set or incorrectly formatted.

**Check your `.env.local` file:**
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

**Common Issues:**
- ❌ Key is missing from `.env.local`
- ❌ Key has line breaks (must be on a single line)
- ❌ Key is not valid JSON
- ❌ File is named `.env` instead of `.env.local`

**Solution:**
1. Open `.env.local` in your project root
2. Make sure `FIREBASE_SERVICE_ACCOUNT_KEY` is set
3. The entire JSON must be on ONE line (no line breaks)
4. Restart your dev server: `npm run dev`

### 2. Verify Firebase Admin Initialization

Check your server console logs. You should see:
```
Firebase Admin initialized successfully
```

If you see:
```
Firebase Admin not initialized: FIREBASE_SERVICE_ACCOUNT_KEY not found
```

Then the service account key is missing or not being read.

### 3. Check Client-Side Auth

Make sure you're logged in:
1. Go to `/login`
2. Sign in with your account
3. Check browser console for any auth errors

### 4. Verify Token is Being Sent

Open browser DevTools → Network tab:
1. Look for requests to `/api/campaigns`
2. Check the Request Headers
3. Should see: `Authorization: Bearer <token>`

If the Authorization header is missing, the token isn't being retrieved.

### 5. Check Environment Variables

Make sure all Firebase variables are set:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_SERVICE_ACCOUNT_KEY=...
```

**Important:** Variables starting with `NEXT_PUBLIC_` are exposed to the browser. The service account key should NOT have this prefix.

### 6. Restart Development Server

After changing `.env.local`:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts.

### 7. Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **adflow-3847a**
3. Go to **Authentication** → **Users**
4. Verify your user account exists

### 8. Test Token Manually

In browser console (after logging in):
```javascript
// Get the current user's token
import { authService } from '@/lib/services/auth.service';
const token = await authService.getIdToken();
console.log('Token:', token);
```

If this returns `null`, the user isn't authenticated properly.

## Quick Fix Checklist

- [ ] `.env.local` file exists in project root
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` is set (single-line JSON)
- [ ] All `NEXT_PUBLIC_FIREBASE_*` variables are set
- [ ] Dev server restarted after adding env variables
- [ ] User is logged in (check `/login`)
- [ ] Firebase Admin shows "initialized successfully" in server logs
- [ ] Browser Network tab shows `Authorization: Bearer <token>` header

## Still Not Working?

1. **Clear browser cache and cookies**
2. **Sign out and sign back in**
3. **Check server console** for detailed error messages
4. **Check browser console** for client-side errors
5. **Verify Firebase project settings** match your `.env.local`

---

**Most Common Fix:** Restart the dev server after adding/updating `.env.local`!

