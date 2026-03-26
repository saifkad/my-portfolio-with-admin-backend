import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// 1. Handle GET (Read Data)
export async function GET() {
  try {
    await connectDB();
    // Return the first user document (the profile)
    const user = await User.findOne({}) || {};
    return NextResponse.json(user);
  } catch (error) {
    console.error("Fetch Error:", error); // Log error to Coolify logs for debugging
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// 2. Handle PUT (Update Data) -> This is what fixes your 405 error
export async function PUT(request) {
  try {
    await connectDB();
    
    // Parse the JSON body sent from the frontend
    const data = await request.json();
    
    // Upsert: Update if exists, create if not
    const user = await User.findOneAndUpdate(
      {}, // Find any user (since we only have one admin profile)
      data, 
      { 
        returnDocument: 'after',      // Return the updated document
        upsert: true,   // Create if it doesn't exist
        setDefaultsOnInsert: true 
      }
    );
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Update Error:", error); // Log error to Coolify logs for debugging
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}