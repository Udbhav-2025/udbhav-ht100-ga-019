import { NextResponse } from 'next/server';
import { isUsingMemoryDB } from '@/lib/db/mongodb';

export async function GET() {
    return NextResponse.json({
        isUsingMemoryDB: isUsingMemoryDB(),
    });
}
