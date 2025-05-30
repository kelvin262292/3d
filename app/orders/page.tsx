"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, Eye, Download, Truck } from "lucide-react"
import Link from "next/link"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-1234",
    date: "2024-01-15",
    status: "in_transit",
    total: 129.99,
    items: 2,
    trackingNumber: "TN123456789",
    estimatedDelivery: "2024-01-20",
  },
  {
    id: "ORD-1235",
    date: "2024-01-10",
    status: "delivered",
    total: 79.99,
    items: 1,
    trackingNumber: "TN123456790",
    estimatedDelivery: "2024-01-15",
  },
  {
    id: "ORD-1236",
    date: "2024-01-05",
    status: "processing",
    total: 249.99,
    items: 3,
    trackingNumber: null,
    estimatedDelivery: "2024-01-25",
  },
]

export default function OrdersPage() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-500"
      case "shipped":
      case "in_transit":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }

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

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Order Tracking</h1>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Search by order ID or tracking number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-gray-600 md:flex-row md:gap-4">
                    <span>Placed: {formatDate(order.date)}</span>
                    <span>Items: {order.items}</span>
                    <span>Total: ${order.total.toFixed(2)}</span>
                  </div>

                  {order.trackingNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}

                  {order.estimatedDelivery && (
                    <div className="text-sm text-gray-600">
                      Estimated delivery: {formatDate(order.estimatedDelivery)}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  </Link>
                  {order.status === "delivered" && (
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            <Button>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
