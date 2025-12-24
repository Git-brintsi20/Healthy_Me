import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// DISABLED: Firebase Auth runs on client-side, middleware runs server-side
// This causes redirect loops. Client-side protection is handled in page layouts.
export function middleware(request: NextRequest) {
  // Just pass through - auth protection happens client-side
  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
  ],
}
