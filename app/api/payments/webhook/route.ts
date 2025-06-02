import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { constructWebhookEvent } from '@/lib/stripe'
import Stripe from 'stripe'
import { logger } from '@/lib/logger'

// POST /api/payments/webhook - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event
    try {
      event = constructWebhookEvent(body, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(paymentIntent)
        break
      }
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentCanceled(paymentIntent)
        break
      }
      default:
        logger.warn('Unhandled webhook event type', 'PAYMENT', { eventType: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    logger.error('Webhook processing failed', 'PAYMENT', { error: error.message })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId
    if (!orderId) {
      logger.error('Missing orderId in payment intent metadata', 'PAYMENT')
      return
    }

    // Update order status
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: 'COMPLETED',
        status: 'PROCESSING', // Move to processing after successful payment
      },
    })

    logger.info('Payment succeeded', 'PAYMENT', { orderId, amount: paymentIntent.amount })
    
    // Here you could add additional logic like:
    // - Send confirmation email
    // - Update inventory
    // - Trigger fulfillment process
  } catch (error: any) {
    logger.error('Error handling payment success', 'PAYMENT', { orderId, error: error.message })
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId
    if (!orderId) {
      logger.error('Missing orderId in payment intent metadata', 'PAYMENT')
      return
    }

    // Update order status
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: 'FAILED',
      },
    })

    logger.warn('Payment failed', 'PAYMENT', { orderId, reason: paymentIntent.last_payment_error?.message })
    
    // Here you could add additional logic like:
    // - Send failure notification email
    // - Log the failure reason
  } catch (error: any) {
    logger.error('Error handling payment failure', 'PAYMENT', { orderId, error: error.message })
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId
    if (!orderId) {
      logger.error('Missing orderId in payment intent metadata', 'PAYMENT')
      return
    }

    // Update order status
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: 'CANCELLED',
        status: 'CANCELLED',
      },
    })

    logger.info('Payment canceled', 'PAYMENT', { orderId })
  } catch (error: any) {
    logger.error('Error handling payment cancellation', 'PAYMENT', { orderId, error: error.message })
  }
}