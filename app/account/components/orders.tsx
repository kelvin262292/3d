"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Search } from "lucide-react"

// Mock order data
const mockOrders = [
  {
    id: "ORD-1234",
    date: "2023-05-15",
    total: 129.99,
    status: "completed",
    items: 3,
  },
  {
    id: "ORD-1235",
    date: "2023-04-28",
    total: 79.99,
    status: "processing",
    items: 1,
  },
  {
    id: "ORD-1236",
    date: "2023-04-10",
    total: 249.99,
    status: "completed",
    items: 2,
  },
  {
    id: "ORD-1237",
    date: "2023-03-22",
    total: 59.99,
    status: "completed",
    items: 1,
  },
  {
    id: "ORD-1238",
    date: "2023-03-05",
    total: 149.99,
    status: "cancelled",
    items: 2,
  },
]

export default function Orders() {
  const { t, language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter orders based on search term and status
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Format date based on language
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

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            {status}
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-500">
            {status}
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="default" className="bg-red-500">
            {status}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">{t.auth.my_orders}</h2>

      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Search orders..."
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
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === "completed" && (
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <div className="p-3 mb-4 rounded-full bg-slate-100">
            <ShoppingBag className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="mb-1 text-lg font-medium">No orders found</h3>
          <p className="mb-4 text-sm text-slate-500">
            {searchTerm || statusFilter !== "all"
              ? "Try changing your search or filter criteria"
              : "You haven't placed any orders yet"}
          </p>
          {!searchTerm && statusFilter === "all" && <Button>Browse Products</Button>}
        </div>
      )}
    </div>
  )
}

// Fallback icon if import fails
function ShoppingBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  )
}
