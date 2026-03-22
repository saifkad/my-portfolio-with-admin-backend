import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
// Only import nodemailer if you are using it for POST, it's not needed for GET

// GET Handler: Fetches messages for Admin
export async function GET() {
  try {
    await connectDB();
    // Sort by newest first
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST Handler: Sends email and saves message
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Save to database
    const contact = await Contact.create(data);

    // Optional: Send email logic here (if you configured nodemailer)
    // If nodemailer fails here, it shouldn't crash the GET above, 
    // but if the whole file crashes, it might. Ensure imports are correct.
    
    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}