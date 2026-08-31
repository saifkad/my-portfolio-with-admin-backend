import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { revalidatePath } from 'next/cache';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars 
    const { _id, __v, ...data } = body;
    data.updatedAt = new Date();

    // Capture the old slug so we can flush its cached page if it changed
    const old = await Post.findById(params.id).select('slug').lean();
    if (!old) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const post = await Post.findByIdAndUpdate(params.id, data, { new: true });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    revalidatePath('/blog');
    revalidatePath(`/blog/${old.slug}`);
    if (data.slug && data.slug !== old.slug) revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json(post);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'That slug is already in use — pick another' }, { status: 400 });
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const post = await Post.findByIdAndDelete(params.id);
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}