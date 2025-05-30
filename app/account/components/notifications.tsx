"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bell, Mail, ShoppingBag, Tag, Gift, AlertTriangle } from "lucide-react"

export default function Notifications() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock notification settings
  const [emailSettings, setEmailSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    newsletter: true,
    accountAlerts: true,
  })

  const [pushSettings, setPushSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newProducts: false,
    priceAlerts: true,
    accountAlerts: true,
  })

  const handleEmailToggle = (setting: keyof typeof emailSettings) => {
    setEmailSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handlePushToggle = (setting: keyof typeof pushSettings) => {
    setPushSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: t.common.success,
        description: "Your notification preferences have been updated.",
      })
    }, 1000)
  }

  // Notification categories with icons
  const notificationCategories = [
    {
      id: "orderUpdates",
      label: "Order Updates",
      description: "Get notified about your order status and delivery updates",
      icon: ShoppingBag,
    },
    {
      id: "promotions",
      label: "Promotions & Discounts",
      description: "Receive special offers, discounts and promotional campaigns",
      icon: Tag,
    },
    {
      id: "newProducts",
      label: "New Products",
      description: "Be the first to know about new 3D models and collections",
      icon: Gift,
    },
    {
      id: "newsletter",
      label: "Newsletter",
      description: "Monthly digest of news and articles about 3D modeling",
      emailOnly: true,
      icon: Mail,
    },
    {
      id: "priceAlerts",
      label: "Price Alerts",
      description: "Get notified when items in your wishlist go on sale",
      pushOnly: true,
      icon: Bell,
    },
    {
      id: "accountAlerts",
      label: "Account Alerts",
      description: "Important updates about your account security and activity",
      icon: AlertTriangle,
    },
  ]

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">{t.auth.notifications}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium">Email Notifications</h3>
          </div>

          <div className="space-y-4">
            {notificationCategories
              .filter((cat) => !cat.pushOnly)
              .map((category) => (
                <div key={`email-${category.id}`} className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-2 text-gray-500" />
                      <Label htmlFor={`email-${category.id}`} className="font-medium">
                        {category.label}
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                  </div>
                  <Switch
                    id={`email-${category.id}`}
                    checked={emailSettings[category.id as keyof typeof emailSettings]}
                    onCheckedChange={() => handleEmailToggle(category.id as keyof typeof emailSettings)}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium">Push Notifications</h3>
          </div>

          <div className="space-y-4">
            {notificationCategories
              .filter((cat) => !cat.emailOnly)
              .map((category) => (
                <div key={`push-${category.id}`} className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-2 text-gray-500" />
                      <Label htmlFor={`push-${category.id}`} className="font-medium">
                        {category.label}
                      </Label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                  </div>
                  <Switch
                    id={`push-${category.id}`}
                    checked={pushSettings[category.id as keyof typeof pushSettings]}
                    onCheckedChange={() => handlePushToggle(category.id as keyof typeof pushSettings)}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="p-4 mb-6 border rounded-lg bg-slate-50">
          <p className="text-sm text-slate-600">
            You can unsubscribe from all marketing communications at any time by clicking the unsubscribe link in any
            email.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  )
}
