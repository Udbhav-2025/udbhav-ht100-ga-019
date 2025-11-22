import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCGtgWRRLW-QSPqeBKLpOvcC5y55CJiLrc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "adflow-3847a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adflow-3847a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "adflow-3847a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "626437175364",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:626437175364:web:23ccbaa0ebfbca870b2411",
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
  // Only initialize on client side
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth };
export default app;

