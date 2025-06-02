'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Lock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireAuth?: boolean
  adminOnly?: boolean
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  redirectTo = '/login',
  requireAuth = true,
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading state
  if (loading) {
    return fallback || <ProtectedRouteLoading />
  }

  // Show error state
  if (error) {
    return <ProtectedRouteError error={error.message} redirectTo={redirectTo} />
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return <ProtectedRouteUnauthorized redirectTo={redirectTo} />
  }

  // Check admin requirement (for future use)
  if (adminOnly && user && !(user as any).isAdmin) {
    return <ProtectedRouteAdminRequired />
  }

  // Render protected content
  return <>{children}</>
}

// Loading component for protected routes
function ProtectedRouteLoading() {
  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-[#d1e6d9]">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-[#39e079]/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-6 h-6 border-2 border-[#39e079] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-3 w-48 mx-auto" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Error component for protected routes
function ProtectedRouteError({ error, redirectTo }: { error: string; redirectTo: string }) {
  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-red-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0e1a13] mb-2">Authentication Error</h2>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
            <Button asChild className="w-full bg-[#39e079] hover:bg-[#39e079]/90">
              <Link href={redirectTo}>Try Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Unauthorized component for protected routes
function ProtectedRouteUnauthorized({ redirectTo }: { redirectTo: string }) {
  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-[#d1e6d9]">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-[#39e079]/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-[#39e079]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0e1a13] mb-2">Authentication Required</h2>
              <p className="text-[#51946b] text-sm">
                You need to be signed in to access this page. Please log in to continue.
              </p>
            </div>
            <div className="space-y-2">
              <Button asChild className="w-full bg-[#39e079] hover:bg-[#39e079]/90">
                <Link href={redirectTo}>Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[#d1e6d9] hover:bg-[#f8fbfa]">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Admin required component (for future use)
function ProtectedRouteAdminRequired() {
  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-orange-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0e1a13] mb-2">Admin Access Required</h2>
              <p className="text-[#51946b] text-sm">
                You don't have permission to access this page. Admin privileges are required.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full border-[#d1e6d9] hover:bg-[#f8fbfa]">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Hook for checking authentication status in components
export function useRequireAuth(redirectTo = '/login') {
  const { user, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isLoading: loading
  }
}