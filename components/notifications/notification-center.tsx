"use client"

import { useState } from "react"
import { Bell, Settings, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/hooks/use-notifications"
import { useLanguage } from "@/hooks/use-language"
import NotificationItem from "./notification-item"
import ConnectionStatus from "./connection-status"

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()
  const { notifications, unreadCount, connectionStatus, isConnected, markAllAsRead, requestNotificationPermission } =
    useNotifications()

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      console.log("Notification permission granted")
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t.notifications}</h3>
            <div className="flex items-center gap-2">
              <ConnectionStatus status={connectionStatus} />
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full">
                {t.markAllAsRead || "Mark all as read"}
              </Button>
            </div>
          )}

          {!isConnected && "Notification" in window && Notification.permission === "default" && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                {t.enableNotifications || "Enable browser notifications to stay updated"}
              </p>
              <Button variant="outline" size="sm" onClick={handleRequestPermission} className="w-full">
                <Wifi className="h-4 w-4 mr-2" />
                {t.enableNotifications || "Enable Notifications"}
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.noNotifications || "No notifications yet"}</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onClose={() => setIsOpen(false)} />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
