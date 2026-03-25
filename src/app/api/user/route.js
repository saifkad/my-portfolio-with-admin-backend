import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Ensure this path is correct
import User from '@/lib/models/User';   // Ensure this path is correct

// GET: Fetch current profile
export async function GET() {
  try {
    await connectDB();
    const user = await User.findOne({}) || {};
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT: Update profile (This is what fixes your issue)
export async function PUT(request) {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Get data from frontend
    const data = await request.json();

    console.log("Updating user with data:", data); // Debugging log

    // 3. Update the document
    // { new: true, upsert: true, setDefaultsOnInsert: true } ensures it updates if exists, or creates if not
    const user = await User.findOneAndUpdate(
      {}, // Find the first (and only) user document
      data, // The new data
      { 
        new: true, // Return the updated document
        upsert: true, 
        setDefaultsOnInsert: true,
        // Use this line if you are on Mongoose 7+ to remove warnings:
        // returnDocument: 'after' 
      }
    );
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}