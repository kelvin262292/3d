import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, isValidEmail } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    })

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    // Set HTTP-only cookie using Next.js 15 async cookies
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days
    
    logger.debug('Setting authentication cookie', 'AUTH', {
      maxAge,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      tokenLength: token.length
    })
    
    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userData,
        token,
      },
      { status: 200 }
    )

    // Set cookie using NextResponse
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: maxAge,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    logger.info('Login successful', 'AUTH', { userId: user.id, email: user.email })
    
    return response
  } catch (error: any) {
    logger.error('Login failed', 'AUTH', { error: error.message })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}