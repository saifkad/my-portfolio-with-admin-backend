import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyToken(request) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const secretKey = request.nextUrl.searchParams.get('secret');

  // RULE 1: Login page requires the secret URL key
  if (path.startsWith('/admin/login')) {
    if (secretKey !== process.env.ADMIN_URL_KEY) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // RULE 2: Dashboard requires a valid JWT
  if (path.startsWith('/admin/dashboard')) {
    if (!(await verifyToken(request))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // RULE 3: Admin API routes require a valid JWT
  // Public exceptions: /api/auth/* and POST /api/contact (public contact form)
  if (path.startsWith('/api/')) {
    const isPublic =
      path.startsWith('/api/auth') ||
      (path.startsWith('/api/contact') && request.method === 'POST');

    if (!isPublic && !(await verifyToken(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};