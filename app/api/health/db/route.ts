import { NextResponse } from 'next/server';
import { connectDB, isUsingMemoryDB } from '@/lib/db/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    const usingMemoryDB = isUsingMemoryDB();
    
    if (usingMemoryDB) {
      return NextResponse.json({
        status: 'warning',
        database: 'in-memory',
        message: 'Using in-memory database - data will be lost on restart',
        persistent: false,
        recommendation: 'Configure MongoDB to persist data',
      }, { status: 200 });
    }

    // Check if MongoDB is actually connected
    const isConnected = mongoose.connection.readyState === 1;
    const dbName = mongoose.connection.db?.databaseName;

    return NextResponse.json({
      status: 'ok',
      database: 'mongodb',
      connected: isConnected,
      databaseName: dbName,
      persistent: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'unknown',
      error: error.message,
      persistent: false,
    }, { status: 500 });
  }
}

