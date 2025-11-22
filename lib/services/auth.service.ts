import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<UserCredential> {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string): Promise<UserCredential> {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    return firebaseSignOut(auth);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    if (!auth) {
      return null;
    }
    return auth.currentUser;
  }

  /**
   * Get current user's ID token
   */
  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return null;
    }
    
    if (!auth.currentUser) {
      console.error('No current user in auth');
      return null;
    }
    
    try {
      const token = await auth.currentUser.getIdToken(forceRefresh);
      return token;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Sign in with Google using popup
   */
  async signInWithGoogle(): Promise<UserCredential> {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    
    const provider = new GoogleAuthProvider();
    
    // Configure the provider
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    
    // Add additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    try {
      // Try popup first (better UX)
      return await signInWithPopup(auth, provider);
    } catch (error: any) {
      // If popup is blocked or fails, provide helpful error message
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please allow popups and try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'unknown';
        throw new Error(`Domain "${domain}" is not authorized. Please add it to Firebase Authorized Domains.`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    if (!auth) {
      throw new Error('Firebase auth not initialized');
    }
    return sendPasswordResetEmail(auth, email);
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!auth) {
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();

