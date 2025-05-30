"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Package, CreditCard, Truck, Bell, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { useLanguage } from "@/hooks/use-language"
import { useRouter } from "next/navigation"
import type { NotificationData } from "@/lib/websocket"

interface NotificationItemProps {
  notification: NotificationData
  onClose?: () => void
}

export default function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { markAsRead, deleteNotification } = useNotifications()
  const { t } = useLanguage()
  const router = useRouter()

  const getIcon = () => {
    switch (notification.type) {
      case "order_update":
        return <Package className="h-4 w-4" />
      case "payment_status":
        return <CreditCard className="h-4 w-4" />
      case "delivery_update":
        return <Truck className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "high":
        return "bg-red-50 border-red-200"
      case "medium":
        return "bg-yellow-50 border-yellow-200"
      case "low":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      onClose?.()
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
    await deleteNotification(notification.id)
  }

  if (isDeleting) {
    return null
  }

  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
        notification.read ? "bg-white" : getPriorityColor()
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${notification.read ? "bg-gray-100" : "bg-white"}`}>{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
            </div>

            <div className="flex items-center gap-1">
              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </span>

            <div className="flex items-center gap-2">
              {notification.priority === "high" && (
                <Badge variant="destructive" className="text-xs">
                  {t.urgent || "Urgent"}
                </Badge>
              )}

              {notification.actionUrl && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
