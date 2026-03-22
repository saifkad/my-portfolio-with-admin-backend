import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose instead of jsonwebtoken

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Protect admin routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // jose requires the secret to be a Uint8Array (TextEncoder)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      // Verify using jose (Edge compatible)
      const { payload } = await jwtVerify(token, secret);
      
      // Optional: You can check payload role here if needed
    } catch (error) {
      // If token is invalid or expired, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};