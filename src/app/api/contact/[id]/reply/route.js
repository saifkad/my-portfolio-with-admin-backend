import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import { sendReplyEmail } from '@/lib/mailer';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { reply } = await request.json();
    const cleanReply = String(reply || '').trim();

    if (!cleanReply) {
      return NextResponse.json({ error: 'Reply text is required' }, { status: 400 });
    }
    if (cleanReply.length > 5000) {
      return NextResponse.json({ error: 'Reply is too long' }, { status: 400 });
    }

    const message = await Contact.findById(params.id);
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

    let emailSent = false;
    try {
      emailSent = await sendReplyEmail(message, cleanReply);
    } catch (e) {
      console.error('Reply email failed:', e);
    }

    await Contact.findByIdAndUpdate(params.id, { replied: true });
    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.error('Error sending reply:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}