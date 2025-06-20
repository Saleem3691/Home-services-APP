// middleware.js
import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/auth';

const protectedRoutes = ['/profile', '/dashboard'];
const authRoutes = ['/login', '/signup'];
const providerRoutes = ['/provider-dashboard'];
const adminRoutes = ['/admin-dashboard'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = getAuthToken(request);
  const decoded = token ? verifyToken(token) : null;

  // Redirect auth routes if logged in
  if (authRoutes.some(route => pathname.startsWith(route)) && decoded) {
    const redirectUrl = new URL(
      decoded.role === 'provider' ? '/provider-dashboard' : 
      decoded.role === 'admin' ? '/admin-dashboard' : '/profile',
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Protect routes that require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !decoded) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role-based access
  if (providerRoutes.some(route => pathname.startsWith(route)) && decoded?.role !== 'provider') {
    const redirectUrl = new URL('/unauthorized', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (adminRoutes.some(route => pathname.startsWith(route)) && decoded?.role !== 'admin') {
    const redirectUrl = new URL('/unauthorized', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}