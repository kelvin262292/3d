import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createPaymentIntent, dollarsToCents } from '@/lib/stripe'

// POST /api/payments/create-intent - Create payment intent for order
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
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

    // Check if order is already paid
    if (order.paymentStatus === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      )
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: dollarsToCents(Number(order.total)),
      orderId: order.id,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        orderTotal: order.total.toString(),
        itemCount: order.orderItems.length.toString(),
      },
    })

    // Update order with payment intent ID
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: 'PROCESSING',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}