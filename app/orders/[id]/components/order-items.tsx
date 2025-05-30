"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye } from "lucide-react"
import Image from "next/image"

interface OrderItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  format: string
  downloadUrl: string
}

interface OrderItemsProps {
  items: OrderItem[]
}

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium mb-1">{item.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {item.format}
                  </Badge>
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                </div>
                <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
