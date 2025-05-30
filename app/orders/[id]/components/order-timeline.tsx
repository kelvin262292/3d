"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, Package, Truck, MapPin } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface TimelineStep {
  status: string
  date: string | null
  title: string
  description: string
  completed: boolean
  current?: boolean
}

interface OrderTimelineProps {
  timeline: TimelineStep[]
}

export default function OrderTimeline({ timeline }: OrderTimelineProps) {
  const { language } = useLanguage()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null

    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }

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

  const getStepIcon = (status: string, completed: boolean, current?: boolean) => {
    const iconClass = `w-5 h-5 ${completed ? "text-green-600" : current ? "text-blue-600" : "text-gray-400"}`

    switch (status) {
      case "order_placed":
        return completed ? <CheckCircle className={iconClass} /> : <Circle className={iconClass} />
      case "payment_confirmed":
        return completed ? <CheckCircle className={iconClass} /> : <Circle className={iconClass} />
      case "processing":
        return completed ? <CheckCircle className={iconClass} /> : <Package className={iconClass} />
      case "shipped":
      case "in_transit":
      case "out_for_delivery":
        return completed ? <CheckCircle className={iconClass} /> : <Truck className={iconClass} />
      case "delivered":
        return completed ? <CheckCircle className={iconClass} /> : <MapPin className={iconClass} />
      default:
        return <Circle className={iconClass} />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((step, index) => (
            <div key={step.status} className="flex gap-4">
              {/* Icon and Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2
                  ${
                    step.completed
                      ? "bg-green-50 border-green-200"
                      : step.current
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                  }
                `}
                >
                  {getStepIcon(step.status, step.completed, step.current)}
                </div>
                {index < timeline.length - 1 && (
                  <div
                    className={`
                    w-0.5 h-12 mt-2
                    ${step.completed ? "bg-green-200" : "bg-gray-200"}
                  `}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-medium ${
                      step.completed ? "text-green-700" : step.current ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  {step.current && (
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                {step.date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(step.date)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
