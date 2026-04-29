import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value

  // Define public paths that don't require authentication
  const isPublicPath = pathname.startsWith('/auth')

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isPublicPath && accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is NOT authenticated and tries to access protected pages, redirect to login
  // We explicitly exclude static files and API routes in the matcher config, 
  // but it's good practice to be careful here too if matcher changes.
  if (!isPublicPath && !accessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images etc if any)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
