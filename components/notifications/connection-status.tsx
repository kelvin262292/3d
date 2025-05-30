"use client"

import { Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  status: "connecting" | "connected" | "disconnected" | "error"
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: <Wifi className="w-3 h-3" />,
          label: "Live",
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "connecting":
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          label: "Connecting",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "disconnected":
        return {
          icon: <WifiOff className="w-3 h-3" />,
          label: "Offline",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        }
      case "error":
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          label: "Error",
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 border-red-200",
        }
      default:
        return {
          icon: <WifiOff className="w-3 h-3" />,
          label: "Unknown",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant={config.variant} className={`text-xs ${config.className}`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
}
