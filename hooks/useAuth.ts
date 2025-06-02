'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { logger } from '@/lib/logger'

interface User {
  id: string
  email: string
  name: string
  username?: string
  phone?: string
  avatar?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt: string
}

interface AuthError {
  message: string
  code?: string
  field?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticating: boolean
  error: AuthError | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  username?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const clearError = () => {
    setError(null)
  }

  const checkAuth = async () => {
    try {
      setLoading(true)
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setError(null)
        logger.info('User authenticated successfully', 'AUTH', { userId: data.user?.id })
      } else if (response.status === 401) {
        // Token expired or invalid - this is normal for unauthenticated users
        setUser(null)
        setError(null)
        logger.debug('User not authenticated (401)', 'AUTH')
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }))
        setError({ message: errorData.error || 'Authentication failed' })
        setUser(null)
        logger.warn('Auth check failed with error', 'AUTH', { status: response.status, error: errorData.error })
      }
    } catch (error: any) {
      logger.error('Auth check failed', 'AUTH', { error: error.message })
      if (error.name === 'AbortError') {
        logger.warn('Auth check timed out', 'AUTH')
      }
      setError(null) // Don't show error for timeout or network issues
      setUser(null)
    } finally {
      setLoading(false)
      logger.debug('Auth check completed', 'AUTH', { loading: false })
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    logger.debug('Login attempt started', 'AUTH', { email, rememberMe })
    setIsAuthenticating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      })

      logger.debug('Login response received', 'AUTH', { status: response.status })
      const data = await response.json()

      if (!response.ok) {
        const authError: AuthError = {
          message: data.error || 'Login failed',
          code: data.code,
          field: data.field
        }
        setError(authError)
        throw authError
      }

      setUser(data.user)
      setError(null)
      
      // Handle redirect after successful login
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirect') || '/dashboard'
      logger.info('Login successful, redirecting', 'AUTH', { redirectTo, userId: data.user?.id })
      // Use window.location.href instead of router.push for immediate redirect
      window.location.href = redirectTo
    } catch (error: any) {
      logger.error('Login failed', 'AUTH', { error: error.message })
      if (error instanceof Error) {
        const authError: AuthError = {
          message: error.message || 'Network error during login'
        }
        setError(authError)
        throw authError
      }
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }

  const register = async (registerData: RegisterData) => {
    setIsAuthenticating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        const authError: AuthError = {
          message: data.error || 'Registration failed',
          code: data.code,
          field: data.field
        }
        setError(authError)
        throw authError
      }

      setUser(data.user)
      setError(null)
      
      // Handle redirect after successful registration
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirect') || '/dashboard'
      router.push(redirectTo)
    } catch (error) {
      console.error('Registration error:', error)
      if (error instanceof Error) {
        const authError: AuthError = {
          message: error.message || 'Network error during registration'
        }
        setError(authError)
        throw authError
      }
      throw error
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = async () => {
    setError(null)
    
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails on server, clear local state
      setUser(null)
      router.push('/')
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    setError(null)
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        const authError: AuthError = {
          message: data.error || 'Profile update failed',
          code: data.code,
          field: data.field
        }
        setError(authError)
        throw authError
      }

      setUser(data.user)
      setError(null)
    } catch (error) {
      console.error('Profile update error:', error)
      if (error instanceof Error) {
        const authError: AuthError = {
          message: error.message || 'Network error during profile update'
        }
        setError(authError)
        throw authError
      }
      throw error
    }
  }

  const refreshUser = async () => {
    setError(null)
    await checkAuth()
  }

  const value = {
    user,
    loading,
    isAuthenticating,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    clearError,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth(redirectTo?: string) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  useEffect(() => {
    if (!loading && !user) {
      const loginUrl = redirectTo || '/auth/login'
      const url = new URL(loginUrl, window.location.origin)
      if (pathname && pathname !== '/auth/login' && pathname !== '/auth/register') {
        url.searchParams.set('redirect', pathname)
      }
      router.push(url.toString().replace(window.location.origin, ''))
    }
  }, [user, loading, router, pathname, redirectTo])

  return { user, loading }
}