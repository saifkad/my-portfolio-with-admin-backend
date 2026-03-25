import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Get the secret key from the URL query parameters
  const secretKey = request.nextUrl.searchParams.get('secret');
  
  // ----------------------------------------------------
  // RULE 1: Protect the Login Page Itself
  // ----------------------------------------------------
  if (path.startsWith('/admin/login')) {
    // If the URL does NOT contain the correct secret key, kick them out to Home.
    if (secretKey !== process.env.ADMIN_URL_KEY) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ----------------------------------------------------
  // RULE 2: Protect the Dashboard
  // ----------------------------------------------------
  if (path.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // IMPORTANT: We redirect to /admin/login WITHOUT the secret.
      // This ensures that if they aren't logged in, they get sent to 
      // the "protected" login page, which will then reject them.
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      // Token is valid, allow access
    } catch (error) {
      console.error('JWT verification failed:', error);
      // Token is invalid, redirect to login (without secret)
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // If everything is fine, continue
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};