import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register", "/reset-password"]
  const isPublicPath = publicPaths.includes(path)

  // Check if user is authenticated (you can check cookies or headers)
  // For Firebase Auth, we'll check for a session cookie
  const token = request.cookies.get("authToken")?.value || ""

  // Redirect logic
  if (!isPublicPath && !token) {
    // Redirect to login if trying to access protected route without auth
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPublicPath && token && path !== "/") {
    // Redirect to dashboard if trying to access auth pages while logged in
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

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
