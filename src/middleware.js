import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const secretKey = request.nextUrl.searchParams.get('secret');
  
  // 1. PROTECT THE LOGIN PAGE ITSELF
  if (path.startsWith('/admin/login')) {
    // If the URL does not contain the correct secret key, send them home
    if (secretKey !== process.env.ADMIN_URL_KEY) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. PROTECT THE DASHBOARD (Existing Logic)
  if (path.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // If they try to access dashboard without token, send to login WITH the secret key
      // (So they don't get stuck in a redirect loop if they are legit)
      return NextResponse.redirect(new URL(`/admin/login?secret=${process.env.ADMIN_URL_KEY}`, request.url));
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL(`/admin/login?secret=${process.env.ADMIN_URL_KEY}`, request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};