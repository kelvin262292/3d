import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'
import { logger } from './logger'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set. Please add JWT_SECRET to your .env.local file.')
}

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  return jwt
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    logger.debug('Token verification started', 'AUTH', { tokenLength: token?.length, hasSecret: !!JWT_SECRET })
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    logger.debug('Token verification successful', 'AUTH', { userId: payload?.userId })
    return payload as JWTPayload
  } catch (error: any) {
    logger.warn('Token verification failed', 'AUTH', { error: error.message })
    return null
  }
}

// Extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }

  return null
}

// Get current user from request
export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Middleware helper to require authentication
export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  
  return { valid: true }
}