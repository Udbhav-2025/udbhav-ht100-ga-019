# Firebase OAuth Domain Setup

## Google Sign-In Unauthorized Domain Error

If you see the error:
```
Firebase: Error (auth/unauthorized-domain)
```

This means your current domain/IP address is not authorized for OAuth operations in Firebase.

## How to Fix

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: **adflow-3847a**

### Step 2: Add Authorized Domain
1. Go to **Authentication** → **Settings** → **Authorized domains** tab
2. Click **Add domain**
3. Add your domain/IP address:
   - For local development: `localhost`
   - For network access: Your IP address (e.g., `10.158.117.143`)
   - For production: Your domain name (e.g., `yourdomain.com`)

### Step 3: Save
- Click **Add** to save the domain
- The domain will be immediately available

## Common Domains to Add

### Development
- `localhost`
- `127.0.0.1`
- Your local IP address (e.g., `10.158.117.143`, `192.168.x.x`)

### Production
- Your production domain
- Any subdomains you use

## Notes

- **localhost** is usually added by default
- **IP addresses** need to be added manually for network access
- Changes take effect immediately
- You can add up to 100 authorized domains per project

## Verification

After adding the domain, try Google sign-in again. The error should be resolved.

