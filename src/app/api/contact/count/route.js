import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const [total, unread] = await Promise.all([
      Contact.countDocuments({}),
      Contact.countDocuments({ read: false }),
    ]);
    return NextResponse.json({ total, unread });
  } catch (error) {
    console.error('Error counting messages:', error);
    return NextResponse.json({ total: 0, unread: 0 }); // badge is a nice-to-have
  }
}