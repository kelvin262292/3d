import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'
import { logger } from './lib/logger'

// Define protected API routes
const protectedApiRoutes = [
  '/api/cart',
  '/api/orders',
  '/api/wishlist',
  '/api/users/profile',
  '/api/upload',
  '/api/payments',
]

// Define protected frontend routes
const protectedFrontendRoutes = [
  '/dashboard',
  '/account',
  '/orders',
  '/wishlist',
  '/checkout',
  '/admin',
]

// Define admin routes (for future use)
const adminRoutes = [
  '/api/admin',
  '/admin',
]

// Define public routes that don't need authentication
const publicRoutes = [
  '/api/auth',
  '/api/products',
  '/api/categories',
  '/api/payments/webhook', // Webhook should be public
]

// Define auth routes (redirect if already authenticated)
const authRoutes = [
  '/login',
  '/register',
  '/auth/login',
  '/auth/register',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value
  const isAuthenticated = !!token
  logger.debug('Middleware processing request', 'AUTH', { hasToken: !!token, pathname })

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    logger.debug('Public route accessed', 'AUTH', { pathname })
    return NextResponse.next()
  }

  // Check if route is auth route (login/register)
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route))
  if (isAuthRoute) {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      try {
        const payload = await verifyToken(token)
        if (payload && payload.userId) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch (error) {
        // Token is invalid, allow access to auth routes
        logger.debug('Invalid token on auth route, allowing access', 'AUTH')
      }
    }
    return NextResponse.next()
  }

  // Check if route is protected
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))
  const isProtectedFrontendRoute = protectedFrontendRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  if (isProtectedApiRoute || isProtectedFrontendRoute || isAdminRoute) {
    if (!token) {
      // For API routes, return JSON error
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      // For frontend routes, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify token
      logger.debug('Verifying token for protected route', 'AUTH', { pathname })
      const payload = await verifyToken(token)
      logger.debug('Token verification completed', 'AUTH', { success: !!payload, userId: payload?.userId })
      
      if (!payload || !payload.userId) {
        logger.warn('Token verification failed, redirecting to login', 'AUTH', { pathname })
        // For API routes, return JSON error
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        // For frontend routes, redirect to login
        return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url))
      }

      // For admin routes, check if user has admin role
      if (isAdminRoute) {
        // TODO: Add admin role check when user roles are implemented
        // For now, we'll skip this check
      }

      // Add user info to request headers for API routes
      if (isProtectedApiRoute) {
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', payload.userId)
        requestHeaders.set('x-user-email', payload.email || '')

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      }

      // For frontend routes, just continue
      return NextResponse.next()
    } catch (error) {
      logger.error('Token verification failed', 'AUTH', { error: error.message })
      
      // For API routes, return JSON error
      if (isProtectedApiRoute) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }
      
      // For frontend routes, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  runtime: 'experimental-edge',
}