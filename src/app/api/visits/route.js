import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Visit from '@/lib/models/Visit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [daily, weekCount, total] = await Promise.all([
      Visit.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Visit.countDocuments({ createdAt: { $gte: weekAgo } }),
      Visit.countDocuments({}),
    ]);

    return NextResponse.json({ daily, weekCount, total });
  } catch (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}