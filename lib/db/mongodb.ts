import mongoose from 'mongoose';
import { memoryDB } from './memory';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agentic-marketer';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };
let useMemoryDB = true; // Default to true, set to false only if connected
let connectionAttempted = false;

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn && !useMemoryDB) {
    // If we have a real MongoDB connection, return it
    return cached.conn;
  }

  if (!cached.promise) {
    connectionAttempted = true;
    cached.promise = (async () => {
      try {
        const opts = {
          bufferCommands: false, // Don't buffer commands if not connected
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 10000, // Increased timeout
          socketTimeoutMS: 45000,
          connectTimeoutMS: 10000,
        };

        console.log('⏳ Connecting to MongoDB...');
        console.log('   URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
        const conn = await mongoose.connect(MONGODB_URI, opts);
        console.log('✅ MongoDB connected successfully');
        console.log('   Database:', conn.connection.db?.databaseName);
        useMemoryDB = false; // Connected successfully
        return conn;
      } catch (error: any) {
        console.error('❌ MongoDB connection failed!');
        console.error('   Error:', error.message);
        console.error('');
        console.error('⚠️  WARNING: Using in-memory database - data will be lost on restart!');
        console.error('');
        console.error('📝 To fix this:');
        console.error('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
        console.error('   2. Start MongoDB: mongod');
        console.error('   3. OR use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
        console.error('   4. Set MONGODB_URI in .env.local file');
        console.error('');
        useMemoryDB = true;
        // Return a mock connection that uses memory DB
        return memoryDB as any;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function isUsingMemoryDB() {
  return useMemoryDB;
}

// Warn on startup if using memory DB (only in development)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  // Only run on server side, in development
  // Use setTimeout to avoid blocking startup
  setTimeout(() => {
    connectDB().then(() => {
      if (useMemoryDB) {
        console.error('');
        console.error('🚨 CRITICAL: Application is using in-memory database!');
        console.error('   All data will be lost when the server restarts.');
        console.error('   Please configure MongoDB to persist your data.');
        console.error('   See: docs/MONGODB_SETUP.md');
        console.error('');
      }
    }).catch(() => {
      // Connection failed, already logged above
    });
  }, 1000);
}

export default connectDB;
