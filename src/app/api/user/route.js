import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    // Return the first user document (the profile)
    const user = await User.findOne({}) || {};
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Upsert: Update if exists, create if not
    const user = await User.findOneAndUpdate({}, data, { 
      new: true, 
      upsert: true, 
      setDefaultsOnInsert: true 
    });
    
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}