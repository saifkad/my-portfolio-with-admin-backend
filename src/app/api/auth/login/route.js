import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Fail loudly if env vars are missing (instead of a cryptic 500 later)
    if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('Missing env vars: JWT_SECRET, ADMIN_EMAIL, or ADMIN_PASSWORD');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const { email, password } = await request.json();

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      cookies().set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}