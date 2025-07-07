import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/history',
  '/favorites',
  '/myths',
];

// Define admin routes that require admin role
const adminRoutes = [
  '/admin',
];

// Define auth routes that should redirect if already authenticated
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/help',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication status from cookie or header
  const isAuthenticated = checkAuthStatus(request);
  const userRole = getUserRole(request);
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );
  
  // Handle admin routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url));
    }
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  // Handle protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url));
    }
    return NextResponse.next();
  }
  
  // Handle auth routes (redirect if already authenticated)
  if (isAuthRoute) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }
  
  // Handle public routes and API routes
  if (isPublicRoute || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Default: allow access but add security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

// Helper function to check authentication status
function checkAuthStatus(request: NextRequest): boolean {
  // Check for Firebase Auth token in cookies
  const authToken = request.cookies.get('__session')?.value;
  
  if (authToken) {
    try {
      // In a real implementation, you would verify the JWT token here
      // For now, we'll assume the presence of the token means authenticated
      return true;
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return false;
    }
  }
  
  // Alternative: Check for custom auth header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return true;
  }
  
  return false;
}

// Helper function to get user role
function getUserRole(request: NextRequest): string | null {
  // Get user role from custom header or token payload
  const roleHeader = request.headers.get('x-user-role');
  
  if (roleHeader) {
    return roleHeader;
  }
  
  // In a real implementation, you would decode the JWT token
  // and extract the role from the payload
  const authToken = request.cookies.get('__session')?.value;
  
  if (authToken) {
    try {
      // Decode JWT and extract role
      // This is a simplified example - in production, use a proper JWT library
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      return payload.role || 'user';
    } catch (error) {
      console.error('Error decoding token for role:', error);
      return 'user';
    }
  }
  
  return null;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

// Export types for use in other files
export type UserRole = 'admin' | 'moderator' | 'user';
export type RouteType = 'protected' | 'admin' | 'auth' | 'public';