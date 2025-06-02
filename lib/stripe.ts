import Stripe from 'stripe'

// Temporarily disable strict env check for build
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export interface CreatePaymentIntentParams {
  amount: number // in cents
  currency?: string
  orderId: string
  customerEmail?: string
  metadata?: Record<string, string>
}

export async function createPaymentIntent({
  amount,
  currency = 'usd',
  orderId,
  customerEmail,
  metadata = {},
}: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer
      currency,
      metadata: {
        orderId,
        ...metadata,
      },
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.confirm(paymentIntentId)
  } catch (error) {
    console.error('Error confirming payment intent:', error)
    throw error
  }
}

export function constructWebhookEvent(body: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
  
  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Error constructing webhook event:', error)
    throw error
  }
}

// Helper function to convert dollars to cents
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100)
}

// Helper function to convert cents to dollars
export function centsToDollars(cents: number): number {
  return cents / 100
}