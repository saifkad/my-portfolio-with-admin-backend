import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    const user = await User.findOne({}) || {};
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET User Error:", error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();

    console.log("Received User Update Data:", data); // Debug log for Coolify

    // 1. Find the user (we assume there is only one profile)
    let user = await User.findOne({});

    // 2. If no user exists, create a new one
    if (!user) {
      user = new User();
    }

    // 3. Update fields explicitly (Safe Mode)
    // This avoids issues with sending undefined fields or nested object conflicts
    if (data.name !== undefined) user.name = data.name;
    if (data.title !== undefined) user.title = data.title;
    if (data.email !== undefined) user.email = data.email;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.profileImage !== undefined) user.profileImage = data.profileImage;
    if (data.backgroundImage !== undefined) user.backgroundImage = data.backgroundImage;
    
    // Update social links carefully
    if (data.socialLinks) {
      if (!user.socialLinks) user.socialLinks = {};
      if (data.socialLinks.github !== undefined) user.socialLinks.github = data.socialLinks.github;
      if (data.socialLinks.linkedin !== undefined) user.socialLinks.linkedin = data.socialLinks.linkedin;
      if (data.socialLinks.twitter !== undefined) user.socialLinks.twitter = data.socialLinks.twitter;
    }

    // 4. Save to database
    await user.save();

    console.log("User Updated Successfully"); // Success log
    return NextResponse.json(user);

  } catch (error) {
    console.error("PUT User Error:", error); // This will print the REAL error in Coolify logs
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message }, 
      { status: 500 }
    );
  }
}