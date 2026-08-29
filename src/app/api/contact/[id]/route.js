import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// PATCH: toggle read/unread (whitelisted to the 'read' field only)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { read } = await request.json();

    const message = await Contact.findByIdAndUpdate(
      params.id,
      { read: Boolean(read) },
      { new: true }
    );
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json(message);
  } catch (error) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const message = await Contact.findByIdAndDelete(params.id);
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}