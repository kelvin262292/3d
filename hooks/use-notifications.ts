"use client"

import { useState, useEffect, useCallback } from "react"
import { useWebSocket, type NotificationData } from "@/lib/websocket"
import { useToast } from "@/hooks/use-toast"

export interface NotificationState {
  notifications: NotificationData[]
  unreadCount: number
  isLoading: boolean
}

export function useNotifications(userId?: string) {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
  })

  const { connectionStatus, subscribe, isConnected } = useWebSocket(userId)
  const { toast } = useToast()

  // Load initial notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // In a real app, this would be an API call
        const mockNotifications: NotificationData[] = [
          {
            id: "1",
            type: "order_update",
            title: "Order Shipped",
            message: "Your order #ORD-1234 has been shipped and is on its way!",
            orderId: "ORD-1234",
            status: "shipped",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            priority: "medium",
            actionUrl: "/orders/ORD-1234",
          },
          {
            id: "2",
            type: "delivery_update",
            title: "Package Delivered",
            message: "Your order #ORD-1233 has been delivered successfully.",
            orderId: "ORD-1233",
            status: "delivered",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
            priority: "high",
            actionUrl: "/orders/ORD-1233",
          },
        ]

        setState((prev) => ({
          ...prev,
          notifications: mockNotifications,
          unreadCount: mockNotifications.filter((n) => !n.read).length,
          isLoading: false,
        }))
      } catch (error) {
        console.error("Failed to load notifications:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadNotifications()
  }, [])

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!isConnected) return

    const unsubscribeNotification = subscribe("notification", (notification: NotificationData) => {
      setState((prev) => ({
        ...prev,
        notifications: [notification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1,
      }))

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        duration: notification.priority === "high" ? 10000 : 5000,
      })

      // Show browser notification if permission granted
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          tag: notification.id,
          requireInteraction: notification.priority === "high",
        })
      }
    })

    const unsubscribeOrderStatus = subscribe("order_status", (data: any) => {
      // Handle order status updates
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) =>
          notification.orderId === data.orderId ? { ...notification, status: data.status } : notification,
        ),
      }))
    })

    return () => {
      unsubscribeNotification()
      unsubscribeOrderStatus()
    }
  }, [isConnected, subscribe, toast])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // In a real app, this would be an API call
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      // In a real app, this would be an API call
      setState((prev) => ({
        ...prev,
        notifications: prev.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      }))
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // In a real app, this would be an API call
      setState((prev) => {
        const notification = prev.notifications.find((n) => n.id === notificationId)
        return {
          ...prev,
          notifications: prev.notifications.filter((n) => n.id !== notificationId),
          unreadCount: notification && !notification.read ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
        }
      })
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return Notification.permission === "granted"
  }, [])

  return {
    ...state,
    connectionStatus,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestNotificationPermission,
  }
}
