import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...validatedData } = data;

    if (!data.title || !data.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const post = await Post.create({ ...data, updatedAt: new Date() });
    revalidatePath('/blog');
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'That slug is already in use — pick another' }, { status: 400 });
    }
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}