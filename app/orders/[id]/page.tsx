"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Package, Truck, CheckCircle, Clock, MapPin, ArrowLeft, Share2, MessageSquare } from "lucide-react"
import Link from "next/link"
import OrderTimeline from "./components/order-timeline"
import OrderItems from "./components/order-items"
import ShippingInfo from "./components/shipping-info"
import OrderNotifications from "./components/order-notifications"
import RealTimeOrderStatus from "@/components/notifications/real-time-order-status"

// Mock order data
const mockOrderData = {
  id: "ORD-1234",
  status: "in_transit",
  orderDate: "2024-01-15T10:30:00Z",
  estimatedDelivery: "2024-01-20T18:00:00Z",
  trackingNumber: "TN123456789",
  total: 129.99,
  subtotal: 109.99,
  shipping: 15.0,
  tax: 5.0,
  paymentMethod: "Credit Card",
  items: [
    {
      id: "1",
      name: "Modern Office Chair 3D Model",
      image: "/placeholder.svg?height=80&width=80",
      price: 49.99,
      quantity: 1,
      format: "FBX, OBJ",
      downloadUrl: "#",
    },
    {
      id: "2",
      name: "Luxury Car Interior Pack",
      image: "/placeholder.svg?height=80&width=80",
      price: 79.99,
      quantity: 1,
      format: "3DS MAX, Blender",
      downloadUrl: "#",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
  },
  timeline: [
    {
      status: "order_placed",
      date: "2024-01-15T10:30:00Z",
      title: "Order Placed",
      description: "Your order has been successfully placed",
      completed: true,
    },
    {
      status: "payment_confirmed",
      date: "2024-01-15T10:35:00Z",
      title: "Payment Confirmed",
      description: "Payment has been processed successfully",
      completed: true,
    },
    {
      status: "processing",
      date: "2024-01-15T14:00:00Z",
      title: "Processing",
      description: "Your order is being prepared for shipment",
      completed: true,
    },
    {
      status: "shipped",
      date: "2024-01-16T09:00:00Z",
      title: "Shipped",
      description: "Your order has been shipped",
      completed: true,
    },
    {
      status: "in_transit",
      date: "2024-01-17T08:00:00Z",
      title: "In Transit",
      description: "Your package is on the way",
      completed: true,
      current: true,
    },
    {
      status: "out_for_delivery",
      date: null,
      title: "Out for Delivery",
      description: "Package is out for delivery",
      completed: false,
    },
    {
      status: "delivered",
      date: null,
      title: "Delivered",
      description: "Package has been delivered",
      completed: false,
    },
  ],
}

export default function OrderTrackingPage() {
  const params = useParams()
  const { t, language } = useLanguage()
  const [order, setOrder] = useState(mockOrderData)
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "order_placed":
      case "payment_confirmed":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "shipped":
      case "in_transit":
        return "bg-purple-500"
      case "out_for_delivery":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "order_placed":
      case "payment_confirmed":
        return <Clock className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = order.timeline.filter((step) => step.completed).length
    return (completedSteps / order.timeline.length) * 100
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }

    switch (language) {
      case "en":
        return date.toLocaleDateString("en-US", options)
      case "zh":
        return date.toLocaleDateString("zh-CN", options)
      case "vi":
        return date.toLocaleDateString("vi-VN", options)
      default:
        return date.toLocaleDateString("en-US", options)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/account">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.orderDate)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Support
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              Order Status
            </CardTitle>
            <Badge className={`${getStatusColor(order.status)} text-white`}>
              {order.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {order.estimatedDelivery && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>Estimated delivery: {formatDate(order.estimatedDelivery)}</span>
              </div>
            )}

            {order.trackingNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-gray-500" />
                <span>Tracking number: {order.trackingNumber}</span>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Track with carrier
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Status Updates */}
      <RealTimeOrderStatus orderId={order.id} currentStatus={order.status} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <OrderTimeline timeline={order.timeline} />

          {/* Order Items */}
          <OrderItems items={order.items} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <ShippingInfo address={order.shippingAddress} />

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600">Paid via {order.paymentMethod}</div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <OrderNotifications enabled={notificationsEnabled} onToggle={setNotificationsEnabled} />
        </div>
      </div>
    </div>
  )
}
