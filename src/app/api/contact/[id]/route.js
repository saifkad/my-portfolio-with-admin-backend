import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// PATCH: To toggle 'read' status
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const id = params.id;
    const body = await request.json();
    
    // Update the message (e.g., toggle read status)
    const updatedMessage = await Contact.findByIdAndUpdate(
      id, 
      { read: body.read }, 
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// DELETE: To remove the message
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const id = params.id;

    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}