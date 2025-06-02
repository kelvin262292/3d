import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET /api/orders/[id] - Get specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Parse shipping address if it's stored as JSON string
    let shippingAddress = null
    if (order.shippingAddress) {
      try {
        shippingAddress = JSON.parse(order.shippingAddress)
      } catch {
        shippingAddress = order.shippingAddress
      }
    }

    return NextResponse.json({
      ...order,
      shippingAddress,
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status (admin only for now)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // For now, only allow users to cancel their own orders
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only allow cancellation if order is still pending
    if (status === 'CANCELLED' && order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Can only cancel pending orders' },
        { status: 400 }
      )
    }

    // For other status updates, you might want to add admin role check here
    if (status !== 'CANCELLED') {
      return NextResponse.json(
        { error: 'Unauthorized to update order status' },
        { status: 403 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}