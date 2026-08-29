export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectDB();
    const user = (await User.findOne({}).lean()) || {};
    return NextResponse.json(user);
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Whitelist: only these fields can ever be written.
    // (Fixes the "_id is immutable" 500 when the form sends the whole doc back.)
    const data = {};
    for (const field of ['name', 'title', 'email', 'location', 'heroIntro', 'bio', 'profileImage', 'backgroundImage']) {
      if (body[field] !== undefined) data[field] = body[field];
    }
    if (body.socialLinks) {
      data.socialLinks = {
        github: body.socialLinks.github ?? '',
        linkedin: body.socialLinks.linkedin ?? '',
        twitter: body.socialLinks.twitter ?? '',
      };
    }
    data.updatedAt = new Date();

    const user = await User.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    revalidatePath('/');

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}