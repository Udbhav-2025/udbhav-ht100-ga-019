# 🎯 Frontend Integration Plan
**Date:** $(date)  
**Objective:** Integrate login, dashboard, and timeline features from `front/Adflow` into main application

---

## 📋 OVERVIEW

### New Features to Integrate
1. **Firebase Authentication** - Login/Signup functionality
2. **Dashboard Page** - Campaign overview with timeline
3. **Timeline Component** - Visual campaign history display
4. **Protected Routes** - Authentication-based access control

### Current State Analysis

#### ✅ What Exists in Main App
- Campaign creation flow (`/campaign/new`)
- Campaign results page (`/campaign/[id]`)
- API routes for campaigns
- MongoDB integration
- Text overlay feature (just implemented)

#### 🆕 What's New in `front/Adflow`
- Login page (`/login`) - UI ready, needs Firebase integration
- Dashboard page (`/dashboard`) - Shows timeline
- Timeline component - Displays campaign history (currently uses mock data)
- Updated landing page styling

---

## 🏗️ IMPLEMENTATION PLAN

### PHASE 1: Firebase Setup & Authentication (Priority: HIGH)

#### 1.1 Install Firebase Dependencies
```bash
npm install firebase
```

#### 1.2 Create Firebase Configuration
**File:** `lib/firebase/config.ts`
- Initialize Firebase app
- Export auth instance
- Export auth methods (signIn, signUp, signOut)

#### 1.3 Create Authentication Service
**File:** `lib/services/auth.service.ts`
- `signInWithEmailAndPassword(email, password)`
- `signUpWithEmailAndPassword(email, password)`
- `signOut()`
- `getCurrentUser()`
- `onAuthStateChanged(callback)`

#### 1.4 Create Auth Context Provider
**File:** `lib/contexts/AuthContext.tsx`
- Provide auth state to entire app
- Handle auth state changes
- Protect routes

#### 1.5 Update Login Page
**File:** `app/login/page.tsx`
- Integrate Firebase authentication
- Handle form submission
- Error handling
- Redirect to dashboard on success

#### 1.6 Create Signup Page
**File:** `app/signup/page.tsx`
- Similar to login but for registration
- Email/password validation
- Firebase signup integration

---

### PHASE 2: Backend Integration for User Management (Priority: HIGH)

#### 2.1 Update Campaign Model
**File:** `lib/models/Campaign.model.ts`
- Add `userId: String` field (required)
- Add index on `userId` for faster queries
- Update TypeScript types

#### 2.2 Create User Model (Optional - for extended user data)
**File:** `lib/models/User.model.ts`
- Store user profile data
- Link to Firebase UID
- Store preferences, settings

#### 2.3 Update Campaign API Routes
**Files:** 
- `app/api/campaigns/route.ts` (POST, GET)
- `app/api/campaigns/[id]/route.ts` (GET, DELETE)

**Changes:**
- Extract `userId` from Firebase token (middleware)
- Filter campaigns by `userId` in GET requests
- Add `userId` to new campaigns in POST
- Verify ownership before DELETE

#### 2.4 Create Auth Middleware
**File:** `lib/middleware/auth.middleware.ts`
- Verify Firebase ID token
- Extract user ID from token
- Add to request context

#### 2.5 Update API Route Handlers
- Add auth middleware to protected routes
- Pass `userId` to service methods
- Return 401/403 for unauthorized access

---

### PHASE 3: Dashboard & Timeline Integration (Priority: MEDIUM)

#### 3.1 Integrate Timeline Component
**File:** `components/Timeline.tsx`
- Replace mock data with real API calls
- Fetch campaigns from `/api/campaigns`
- Map campaign data to timeline format
- Handle loading/error states

#### 3.2 Update Dashboard Page
**File:** `app/dashboard/page.tsx`
- Add authentication check (redirect if not logged in)
- Fetch user's campaigns
- Display timeline with real data
- Add stats/overview cards

#### 3.3 Create Campaign Stats Component (Optional)
**File:** `components/CampaignStats.tsx`
- Total campaigns
- Active campaigns
- Completed campaigns
- Recent activity

---

### PHASE 4: Route Protection & Navigation (Priority: MEDIUM)

#### 4.1 Create Protected Route Component
**File:** `components/ProtectedRoute.tsx`
- Check authentication status
- Redirect to login if not authenticated
- Show loading state

#### 4.2 Update Campaign Pages
**Files:**
- `app/campaign/new/page.tsx` - Add auth check
- `app/campaign/[id]/page.tsx` - Add auth check + ownership verification

#### 4.3 Update Landing Page
**File:** `app/page.tsx`
- Add "Login" button in header
- Redirect authenticated users to dashboard
- Keep "Start Campaign" button (will redirect to login if not authenticated)

#### 4.4 Add Navigation Component
**File:** `components/Navigation.tsx`
- Header with user menu
- Logout button
- Dashboard link
- Campaign creation link

---

### PHASE 5: Timeline Data Integration (Priority: MEDIUM)

#### 5.1 Update Timeline Component Data Structure
**Current:** Uses hardcoded `Post[]` interface
**New:** Map `Campaign[]` to timeline format

**Mapping:**
```typescript
Campaign → Timeline Post:
- campaign._id → post.id
- campaign.platforms[0] → post.platform
- campaign.status → post.type
- campaign.createdAt → post.date
- campaign.generatedContent → post.title/content
- campaign.generatedImages → post.media
- campaign.critique?.overallScore → post.stats
```

#### 5.2 Add Campaign Details to Timeline
- Show campaign status (pending, completed, failed)
- Display generated content preview
- Link to full campaign page
- Show critique score

#### 5.3 Add Filtering/Sorting
- Filter by platform
- Sort by date (newest first)
- Filter by status

---

### PHASE 6: Environment Configuration (Priority: HIGH)

#### 6.1 Update `.env.example`
Add Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### 6.2 Update Documentation
- Add Firebase setup instructions
- Update README with auth flow
- Document environment variables

---

## 📁 FILE STRUCTURE CHANGES

### New Files to Create
```
lib/
  ├── firebase/
  │   └── config.ts                    # Firebase initialization
  ├── services/
  │   └── auth.service.ts              # Auth service methods
  ├── contexts/
  │   └── AuthContext.tsx              # Auth context provider
  ├── middleware/
  │   └── auth.middleware.ts           # API auth middleware
  └── models/
      └── User.model.ts                # User model (optional)

app/
  ├── login/
  │   └── page.tsx                     # Login page (update existing)
  ├── signup/
  │   └── page.tsx                     # Signup page (new)
  └── dashboard/
      └── page.tsx                     # Dashboard page (update existing)

components/
  ├── Timeline.tsx                     # Timeline component (update existing)
  ├── ProtectedRoute.tsx               # Route protection (new)
  ├── Navigation.tsx                   # Navigation header (new)
  └── CampaignStats.tsx                # Stats component (optional)
```

### Files to Update
```
lib/models/Campaign.model.ts            # Add userId field
app/api/campaigns/route.ts             # Add auth + userId filtering
app/api/campaigns/[id]/route.ts       # Add auth + ownership check
app/campaign/new/page.tsx              # Add auth check
app/campaign/[id]/page.tsx             # Add auth + ownership check
app/layout.tsx                         # Add AuthContext provider
components/Timeline.tsx                # Replace mock data with API calls
```

---

## 🔄 DATA FLOW

### Authentication Flow
```
1. User visits /login
2. Enters email/password
3. Firebase authenticates
4. ID token stored (cookie/localStorage)
5. Redirect to /dashboard
```

### Campaign Creation Flow (Updated)
```
1. User clicks "New Campaign" (must be authenticated)
2. Fills campaign form
3. POST /api/campaigns
   - Middleware extracts userId from token
   - Campaign created with userId
4. Redirect to campaign status page
```

### Timeline Data Flow
```
1. User visits /dashboard
2. Component fetches /api/campaigns?userId={currentUserId}
3. Backend filters campaigns by userId
4. Timeline component maps campaigns to timeline format
5. Display in chronological order
```

---

## 🔐 SECURITY CONSIDERATIONS

### 1. Token Verification
- Verify Firebase ID tokens on server-side
- Use Firebase Admin SDK for server verification
- Reject invalid/expired tokens

### 2. User Isolation
- All API routes must filter by userId
- Prevent users from accessing other users' campaigns
- Add ownership checks before DELETE operations

### 3. Route Protection
- Client-side: Redirect to login if not authenticated
- Server-side: Verify token on API routes
- Return 401 for unauthenticated requests
- Return 403 for unauthorized access

---

## 📦 DEPENDENCIES TO ADD

```json
{
  "firebase": "^10.7.1",
  "firebase-admin": "^12.0.0"  // For server-side token verification
}
```

---

## 🧪 TESTING CHECKLIST

### Authentication
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User can sign out
- [ ] Auth state persists on page refresh
- [ ] Invalid credentials show error message

### Route Protection
- [ ] Unauthenticated users redirected to login
- [ ] Authenticated users can access protected routes
- [ ] Campaign creation requires authentication
- [ ] Dashboard requires authentication

### Data Isolation
- [ ] Users only see their own campaigns
- [ ] Users cannot access other users' campaigns via URL
- [ ] API returns 403 for unauthorized campaign access

### Timeline
- [ ] Timeline displays user's campaigns
- [ ] Campaigns sorted by date (newest first)
- [ ] Timeline shows correct platform icons
- [ ] Expandable details work correctly
- [ ] Links to campaign pages work

---

## 🚀 IMPLEMENTATION ORDER

### Step 1: Firebase Setup (30 min)
1. Install Firebase packages
2. Create Firebase project (console)
3. Add config file
4. Test connection

### Step 2: Authentication Service (45 min)
1. Create auth service
2. Create auth context
3. Update login page
4. Create signup page
5. Test auth flow

### Step 3: Backend Integration (60 min)
1. Update Campaign model (add userId)
2. Create auth middleware
3. Update API routes (add auth + userId)
4. Test API with authenticated requests

### Step 4: Dashboard & Timeline (45 min)
1. Update dashboard page
2. Update Timeline component (real data)
3. Add route protection
4. Test end-to-end flow

### Step 5: Polish & Testing (30 min)
1. Add navigation component
2. Update landing page
3. Test all flows
4. Fix any issues

**Total Estimated Time: ~3.5 hours**

---

## 📝 NOTES

1. **Firebase Admin SDK**: Required for server-side token verification. Install separately and initialize with service account.

2. **User Model**: Optional. Can start with just Firebase UID stored in campaigns. Add User model later if needed for profiles/settings.

3. **Timeline Data**: Currently uses mock data. Need to map Campaign model to Timeline Post interface.

4. **Migration**: Existing campaigns won't have userId. Need migration script or default handling.

5. **Error Handling**: Add comprehensive error handling for:
   - Network failures
   - Auth errors
   - API errors
   - Invalid tokens

---

## ✅ SUCCESS CRITERIA

- [ ] Users can sign up and log in
- [ ] Campaigns are linked to users
- [ ] Users can only see their own campaigns
- [ ] Dashboard displays timeline with real data
- [ ] All routes are properly protected
- [ ] Application works end-to-end

---

**END OF PLAN**

