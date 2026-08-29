import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import { sendNewMessageEmail } from '@/lib/mailer';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

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
    // Rate limit: 5 messages per hour per IP
    const limited = rateLimit(`contact:${getClientIp(request)}`, 5, 60 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Too many messages. Please try again in ${Math.ceil(limited.retryAfter / 60)} minutes.` },
        { status: 429 }
      );
    }

    const data = await request.json();

    // Honeypot: bots fill hidden fields. Pretend success, save nothing.
    if (data.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const clean = {
      name: String(data.name || '').trim(),
      email: String(data.email || '').trim(),
      message: String(data.message || '').trim(),
    };

    if (!clean.name || !clean.email || !clean.message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (clean.message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    await connectDB();
    const contact = await Contact.create(clean);

    // Email notification — a failure here must never fail the save
    sendNewMessageEmail(clean).catch((err) => console.error('Email notification failed:', err));

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}