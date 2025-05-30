"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export interface NotificationData {
  id: string
  type: "order_update" | "payment_status" | "delivery_update" | "system_message"
  title: string
  message: string
  orderId?: string
  status?: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

export interface WebSocketMessage {
  type: "notification" | "order_status" | "heartbeat" | "connection_status"
  data: any
  timestamp: string
}

// Mock WebSocket for development/demo purposes
class MockWebSocket {
  private listeners: { [key: string]: ((event: any) => void)[] } = {}
  private readyState: number = WebSocket.CONNECTING
  private intervalId: NodeJS.Timeout | null = null

  constructor(url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN
      this.dispatchEvent("open", {})
      this.startMockNotifications()
    }, 1000)
  }

  addEventListener(event: string, callback: (event: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  removeEventListener(event: string, callback: (event: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  send(data: string) {
    // Echo heartbeat responses
    try {
      const message = JSON.parse(data)
      if (message.type === "heartbeat_response") {
        // Handle heartbeat response
        console.log("Heartbeat response received")
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  close() {
    this.readyState = WebSocket.CLOSED
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.dispatchEvent("close", {})
  }

  private dispatchEvent(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }

  private startMockNotifications() {
    let notificationCount = 0

    // Send initial notifications
    setTimeout(() => {
      this.sendMockNotification({
        id: `mock-${++notificationCount}`,
        type: "order_update",
        title: "Order Status Updated",
        message: "Your order #ORD-1234 has been shipped!",
        orderId: "ORD-1234",
        status: "shipped",
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
        actionUrl: "/orders/ORD-1234",
      })
    }, 2000)

    // Send periodic notifications
    this.intervalId = setInterval(() => {
      const mockNotifications = [
        {
          type: "delivery_update",
          title: "Package Out for Delivery",
          message: "Your package will arrive today between 2-6 PM",
          priority: "high",
        },
        {
          type: "system_message",
          title: "New 3D Models Available",
          message: "Check out our latest architectural collection",
          priority: "low",
        },
        {
          type: "order_update",
          title: "Order Processing",
          message: "Your order is being prepared for shipment",
          priority: "medium",
        },
      ]

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]

      this.sendMockNotification({
        id: `mock-${++notificationCount}`,
        ...randomNotification,
        timestamp: new Date().toISOString(),
        read: false,
      } as NotificationData)
    }, 30000) // Every 30 seconds
  }

  private sendMockNotification(notification: NotificationData) {
    const message = {
      type: "notification",
      data: notification,
      timestamp: new Date().toISOString(),
    }

    this.dispatchEvent("message", {
      data: JSON.stringify(message),
    })
  }

  // WebSocket constants
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSING = 2
  static readonly CLOSED = 3
}

class WebSocketManager {
  private ws: WebSocket | MockWebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectDelay = 2000
  private heartbeatInterval: NodeJS.Timeout | null = null
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private connectionStatus: "connecting" | "connected" | "disconnected" | "error" = "disconnected"
  private useMockWebSocket = false

  constructor(
    private url: string,
    private userId?: string,
  ) {
    // Use mock WebSocket in development or when real WebSocket fails
    this.useMockWebSocket = process.env.NODE_ENV === "development" || typeof window === "undefined"
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.connectionStatus = "connecting"
    this.notifyListeners("connection_status", { status: this.connectionStatus })

    try {
      if (this.useMockWebSocket) {
        this.ws = new MockWebSocket(this.url)
      } else {
        const wsUrl = this.userId ? `${this.url}?userId=${this.userId}` : this.url
        this.ws = new WebSocket(wsUrl)
      }

      this.setupEventListeners()
    } catch (error) {
      console.warn("WebSocket connection failed, falling back to mock:", error)
      this.useMockWebSocket = true
      this.ws = new MockWebSocket(this.url)
      this.setupEventListeners()
    }
  }

  private setupEventListeners() {
    if (!this.ws) return

    if ("onopen" in this.ws) {
      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.connectionStatus = "connected"
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.notifyListeners("connection_status", { status: this.connectionStatus })
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.connectionStatus = "disconnected"
        this.stopHeartbeat()
        this.notifyListeners("connection_status", { status: this.connectionStatus })
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.warn("WebSocket error, switching to mock mode:", error)
        this.connectionStatus = "error"
        this.notifyListeners("connection_status", { status: this.connectionStatus })

        // Fall back to mock WebSocket
        if (!this.useMockWebSocket) {
          this.useMockWebSocket = true
          this.disconnect()
          setTimeout(() => this.connect(), 1000)
        }
      }
    } else {
      // Handle MockWebSocket
      this.ws.addEventListener("open", () => {
        console.log("Mock WebSocket connected")
        this.connectionStatus = "connected"
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.notifyListeners("connection_status", { status: this.connectionStatus })
      })

      this.ws.addEventListener("message", (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      })

      this.ws.addEventListener("close", () => {
        console.log("Mock WebSocket disconnected")
        this.connectionStatus = "disconnected"
        this.stopHeartbeat()
        this.notifyListeners("connection_status", { status: this.connectionStatus })
      })
    }
  }

  disconnect() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.connectionStatus = "disconnected"
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case "notification":
        this.notifyListeners("notification", message.data)
        break
      case "order_status":
        this.notifyListeners("order_status", message.data)
        break
      case "heartbeat":
        // Respond to heartbeat
        this.send({ type: "heartbeat_response", timestamp: new Date().toISOString() })
        break
      default:
        this.notifyListeners(message.type, message.data)
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: "heartbeat", timestamp: new Date().toISOString() })
      }
    }, 30000) // Send heartbeat every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * this.reconnectAttempts

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      )

      setTimeout(() => {
        this.connect()
      }, delay)
    } else {
      console.warn("Max reconnection attempts reached, staying in mock mode")
      this.useMockWebSocket = true
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn("WebSocket is not connected")
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event)
      if (eventListeners) {
        eventListeners.delete(callback)
        if (eventListeners.size === 0) {
          this.listeners.delete(event)
        }
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }

  getConnectionStatus() {
    return this.connectionStatus
  }
}

// Singleton instance
let wsManager: WebSocketManager | null = null

export function getWebSocketManager(userId?: string): WebSocketManager {
  if (!wsManager) {
    // In production, this would be your actual WebSocket server URL
    const wsUrl = process.env.NODE_ENV === "production" ? "wss://api.your-domain.com/ws" : "ws://localhost:8080/ws"

    wsManager = new WebSocketManager(wsUrl, userId)
  }
  return wsManager
}

// React hook for WebSocket connection
export function useWebSocket(userId?: string) {
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const wsManagerRef = useRef<WebSocketManager | null>(null)

  useEffect(() => {
    wsManagerRef.current = getWebSocketManager(userId)

    const unsubscribe = wsManagerRef.current.subscribe("connection_status", (data) => {
      setConnectionStatus(data.status)
    })

    wsManagerRef.current.connect()

    return () => {
      unsubscribe()
      if (wsManagerRef.current) {
        wsManagerRef.current.disconnect()
      }
    }
  }, [userId])

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    return wsManagerRef.current?.subscribe(event, callback) || (() => {})
  }, [])

  const send = useCallback((data: any) => {
    wsManagerRef.current?.send(data)
  }, [])

  return {
    connectionStatus,
    subscribe,
    send,
    isConnected: connectionStatus === "connected",
  }
}
