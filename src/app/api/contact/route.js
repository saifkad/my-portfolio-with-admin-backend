import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

// GET (admin only — protected by middleware)
export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST (public — the contact form)
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    const clean = {
      name: String(name || '').trim(),
      email: String(email || '').trim(),
      message: String(message || '').trim(),
    };

    if (!clean.name || !clean.email || !clean.message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (clean.message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    await connectDB();
    const contact = await Contact.create(clean);
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}