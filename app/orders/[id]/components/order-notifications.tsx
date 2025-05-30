"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Bell, Mail, Smartphone } from "lucide-react"

interface OrderNotificationsProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function OrderNotifications({ enabled, onToggle }: OrderNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Email updates</span>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gray-500" />
            <span className="text-sm">SMS updates</span>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full">
            Manage Preferences
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          Get notified about delivery updates, delays, and when your package arrives.
        </div>
      </CardContent>
    </Card>
  )
}
