import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visit from '@/lib/models/Visit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { path, referrer } = await request.json();
    if (typeof path !== 'string' || path.length > 200) {
      return NextResponse.json({ ok: true }); // ignore junk, never error
    }
    await connectDB();
    await Visit.create({
      path: path.slice(0, 200),
      referrer: typeof referrer === 'string' ? referrer.slice(0, 300) : '',
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }); // tracking must never break a visitor's page
  }
}