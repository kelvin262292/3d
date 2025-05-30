"use client"

import { useEffect, useState } from "react"
import { useWebSocket } from "@/lib/websocket"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Package, CheckCircle, Clock } from "lucide-react"

interface OrderStatusUpdate {
  orderId: string
  status: string
  timestamp: string
  location?: string
  estimatedDelivery?: string
}

interface RealTimeOrderStatusProps {
  orderId: string
  currentStatus: string
}

export default function RealTimeOrderStatus({ orderId, currentStatus }: RealTimeOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [location, setLocation] = useState<string | null>(null)
  const { subscribe, isConnected } = useWebSocket()

  useEffect(() => {
    if (!isConnected) return

    const unsubscribe = subscribe("order_status", (data: OrderStatusUpdate) => {
      if (data.orderId === orderId) {
        setStatus(data.status)
        setLastUpdate(data.timestamp)
        if (data.location) {
          setLocation(data.location)
        }
      }
    })

    return unsubscribe
  }, [isConnected, subscribe, orderId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
      case "in_transit":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500"
      case "shipped":
      case "in_transit":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span className="font-medium">Real-time Status</span>
            {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
          </div>

          <Badge className={`${getStatusColor(status)} text-white`}>{status.replace("_", " ").toUpperCase()}</Badge>
        </div>

        {location && <div className="mt-2 text-sm text-gray-600">Current location: {location}</div>}

        {lastUpdate && (
          <div className="mt-2 text-xs text-gray-500">Last updated: {new Date(lastUpdate).toLocaleString()}</div>
        )}

        {!isConnected && (
          <div className="mt-2 text-xs text-yellow-600">Real-time updates unavailable - showing cached status</div>
        )}
      </CardContent>
    </Card>
  )
}
