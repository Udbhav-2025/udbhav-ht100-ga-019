import { NextRequest } from 'next/server';
import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    // Try to read from service account file first
    const serviceAccountPath = path.join(process.cwd(), 'adflow-3847a-firebase-adminsdk-fbsvc-6f20429933.json');
    
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      // Firebase Admin initialized successfully
    } else {
      // Fallback to environment variable
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (serviceAccountKey) {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        // Firebase Admin initialized from env variable
      } else {
        console.error('Firebase Admin not initialized: Service account file or FIREBASE_SERVICE_ACCOUNT_KEY not found');
      }
    }
  } catch (error: any) {
    console.error('Error initializing Firebase Admin:', error.message || error);
  }
}

export interface AuthRequest extends NextRequest {
  userId?: string;
}

/**
 * Middleware to verify Firebase ID token and extract user ID
 */
export async function verifyAuth(request: NextRequest): Promise<{ userId: string } | null> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return null;
    }

    // Verify token with Firebase Admin
    if (!admin.apps.length) {
      console.error('Firebase Admin not initialized');
      return null;
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    return { userId: decodedToken.uid };
  } catch (error: any) {
    console.error('Token verification error:', error.message || error);
    return null;
  }
}

/**
 * Get user ID from request (for use in API routes)
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const authResult = await verifyAuth(request);
  return authResult?.userId || null;
}

