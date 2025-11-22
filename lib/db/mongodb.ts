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

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        const opts = {
          bufferCommands: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000, // Fail fast if no connection
          socketTimeoutMS: 5000,
        };

        console.log('⏳ Connecting to MongoDB...');
        const conn = await mongoose.connect(MONGODB_URI, opts);
        console.log('✅ MongoDB connected');
        useMemoryDB = false; // Connected successfully
        return conn;
      } catch (error: any) {
        console.warn('⚠️ MongoDB connection failed, using in-memory database');
        console.warn('   Error:', error.message);
        console.warn('   To use MongoDB: install locally or set MONGODB_URI in .env');
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

export default connectDB;
