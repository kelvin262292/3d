import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { hashPassword, validateEmail } from '@/lib/auth'

// GET /api/users/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user with additional stats
    const userWithStats = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            cartItems: true,
            wishlist: true,
          },
        },
      },
    })

    if (!userWithStats) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: userWithStats,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, username, phone, avatar, currentPassword, newPassword } = body

    // Validate input
    const updateData: any = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return NextResponse.json(
          { error: 'Name must be at least 2 characters long' },
          { status: 400 }
        )
      }
      updateData.name = name.trim()
    }

    if (username !== undefined) {
      if (typeof username !== 'string' || username.trim().length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters long' },
          { status: 400 }
        )
      }

      // Check if username is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username.trim(),
          NOT: {
            id: user.id,
          },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }

      updateData.username = username.trim()
    }

    if (phone !== undefined) {
      if (phone && typeof phone !== 'string') {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        )
      }
      updateData.phone = phone || null
    }

    if (avatar !== undefined) {
      if (avatar && typeof avatar !== 'string') {
        return NextResponse.json(
          { error: 'Invalid avatar URL format' },
          { status: 400 }
        )
      }
      updateData.avatar = avatar || null
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        )
      }

      // Get current user with password
      const currentUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          password: true,
        },
      })

      if (!currentUser?.password) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Verify current password
      const bcrypt = require('bcryptjs')
      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long' },
          { status: 400 }
        )
      }

      // Hash new password
      updateData.password = await hashPassword(newPassword)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}