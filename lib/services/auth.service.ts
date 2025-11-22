import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
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

