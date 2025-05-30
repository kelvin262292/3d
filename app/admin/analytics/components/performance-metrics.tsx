"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/hooks/use-language"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Server, Clock, AlertTriangle, Database, Wifi } from "lucide-react"

interface PerformanceMetricsProps {
  timeRange: string
}

const getPerformanceData = (language: string) => ({
  systemMetrics: [
    {
      title: language === "en" ? "Page Load Time" : language === "zh" ? "页面加载时间" : "Thời gian tải trang",
      value: "1.2s",
      target: "< 2s",
      score: 85,
      status: "good",
      icon: Clock,
    },
    {
      title: language === "en" ? "Server Response" : language === "zh" ? "服务器响应" : "Phản hồi máy chủ",
      value: "180ms",
      target: "< 200ms",
      score: 92,
      status: "excellent",
      icon: Server,
    },
    {
      title: language === "en" ? "Database Queries" : language === "zh" ? "数据库查询" : "Truy vấn cơ sở dữ liệu",
      value: "45ms",
      target: "< 100ms",
      score: 88,
      status: "good",
      icon: Database,
    },
    {
      title: language === "en" ? "API Latency" : language === "zh" ? "API延迟" : "Độ trễ API",
      value: "95ms",
      target: "< 150ms",
      score: 90,
      status: "excellent",
      icon: Wifi,
    },
  ],
  performanceTrends: [
    { time: "00:00", loadTime: 1.1, responseTime: 165, uptime: 99.9 },
    { time: "04:00", loadTime: 1.0, responseTime: 145, uptime: 99.8 },
    { time: "08:00", loadTime: 1.4, responseTime: 190, uptime: 99.9 },
    { time: "12:00", loadTime: 1.8, responseTime: 220, uptime: 99.7 },
    { time: "16:00", loadTime: 1.6, responseTime: 200, uptime: 99.8 },
    { time: "20:00", loadTime: 1.3, responseTime: 175, uptime: 99.9 },
  ],
  errorRates: [
    { date: "Mon", errors: 12, requests: 15000, rate: 0.08 },
    { date: "Tue", errors: 8, requests: 14200, rate: 0.06 },
    { date: "Wed", errors: 15, requests: 16800, rate: 0.09 },
    { date: "Thu", errors: 6, requests: 15600, rate: 0.04 },
    { date: "Fri", errors: 10, requests: 18200, rate: 0.05 },
    { date: "Sat", errors: 18, requests: 20100, rate: 0.09 },
    { date: "Sun", errors: 14, requests: 17900, rate: 0.08 },
  ],
  coreWebVitals: {
    lcp: { value: 1.8, score: 88, status: "good" }, // Largest Contentful Paint
    fid: { value: 45, score: 95, status: "excellent" }, // First Input Delay
    cls: { value: 0.05, score: 92, status: "excellent" }, // Cumulative Layout Shift
    fcp: { value: 1.1, score: 90, status: "excellent" }, // First Contentful Paint
  },
  resourceUsage: [
    { resource: "CPU", usage: 68, limit: 100, status: "normal" },
    { resource: "Memory", usage: 72, limit: 100, status: "normal" },
    { resource: "Storage", usage: 45, limit: 100, status: "good" },
    { resource: "Bandwidth", usage: 82, limit: 100, status: "warning" },
  ],
  incidents: [
    {
      id: 1,
      title: language === "en" ? "High API Latency" : language === "zh" ? "API延迟过高" : "Độ trễ API cao",
      severity: "medium",
      status: "resolved",
      time: "2 hours ago",
      duration: "15m",
    },
    {
      id: 2,
      title:
        language === "en"
          ? "Database Connection Timeout"
          : language === "zh"
            ? "数据库连接超时"
            : "Kết nối CSDL hết thời gian",
      severity: "high",
      status: "investigating",
      time: "30 minutes ago",
      duration: "ongoing",
    },
  ],
})

export default function PerformanceMetrics({ timeRange }: PerformanceMetricsProps) {
  const { language } = useLanguage()
  const performanceData = getPerformanceData(language)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceData.systemMetrics.map((metric, index) => (
          <Card key={index} className="border-[#d1e6d9]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-6 h-6 ${getStatusColor(metric.status)}`} />
                <Badge
                  variant={
                    metric.status === "excellent" ? "default" : metric.status === "good" ? "secondary" : "destructive"
                  }
                  className={
                    metric.status === "excellent"
                      ? "bg-green-100 text-green-800"
                      : metric.status === "good"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {metric.score}%
                </Badge>
              </div>
              <h3 className="font-semibold text-[#0e1a13] mb-2">{metric.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#0e1a13]">{metric.value}</span>
                  <span className="text-sm text-[#51946b]">Target: {metric.target}</span>
                </div>
                <Progress value={metric.score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Performance Trends" : language === "zh" ? "性能趋势" : "Xu hướng hiệu suất"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                loadTime: {
                  label:
                    language === "en" ? "Load Time (s)" : language === "zh" ? "加载时间 (秒)" : "Thời gian tải (s)",
                  color: "#39e079",
                },
                responseTime: {
                  label:
                    language === "en"
                      ? "Response Time (ms)"
                      : language === "zh"
                        ? "响应时间 (毫秒)"
                        : "Thời gian phản hồi (ms)",
                  color: "#0ea5e9",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="loadTime" stroke="#39e079" strokeWidth={2} />
                  <Line type="monotone" dataKey="responseTime" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Error Rates */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Error Rates" : language === "zh" ? "错误率" : "Tỷ lệ lỗi"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: language === "en" ? "Error Rate (%)" : language === "zh" ? "错误率 (%)" : "Tỷ lệ lỗi (%)",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData.errorRates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `${value}%`,
                      language === "en" ? "Error Rate" : language === "zh" ? "错误率" : "Tỷ lệ lỗi",
                    ]}
                  />
                  <Bar dataKey="rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Web Vitals */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Core Web Vitals" : language === "zh" ? "核心网页指标" : "Chỉ số Web cốt lõi"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8fbfa] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#51946b]">LCP</span>
                  <Badge
                    variant={performanceData.coreWebVitals.lcp.status === "excellent" ? "default" : "secondary"}
                    className={
                      performanceData.coreWebVitals.lcp.status === "excellent"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {performanceData.coreWebVitals.lcp.score}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[#0e1a13]">{performanceData.coreWebVitals.lcp.value}s</p>
                <p className="text-xs text-[#51946b]">Largest Contentful Paint</p>
              </div>

              <div className="p-4 bg-[#f8fbfa] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#51946b]">FID</span>
                  <Badge
                    variant={performanceData.coreWebVitals.fid.status === "excellent" ? "default" : "secondary"}
                    className={
                      performanceData.coreWebVitals.fid.status === "excellent"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {performanceData.coreWebVitals.fid.score}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[#0e1a13]">{performanceData.coreWebVitals.fid.value}ms</p>
                <p className="text-xs text-[#51946b]">First Input Delay</p>
              </div>

              <div className="p-4 bg-[#f8fbfa] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#51946b]">CLS</span>
                  <Badge
                    variant={performanceData.coreWebVitals.cls.status === "excellent" ? "default" : "secondary"}
                    className={
                      performanceData.coreWebVitals.cls.status === "excellent"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {performanceData.coreWebVitals.cls.score}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[#0e1a13]">{performanceData.coreWebVitals.cls.value}</p>
                <p className="text-xs text-[#51946b]">Cumulative Layout Shift</p>
              </div>

              <div className="p-4 bg-[#f8fbfa] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#51946b]">FCP</span>
                  <Badge
                    variant={performanceData.coreWebVitals.fcp.status === "excellent" ? "default" : "secondary"}
                    className={
                      performanceData.coreWebVitals.fcp.status === "excellent"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {performanceData.coreWebVitals.fcp.score}%
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-[#0e1a13]">{performanceData.coreWebVitals.fcp.value}s</p>
                <p className="text-xs text-[#51946b]">First Contentful Paint</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Resource Usage" : language === "zh" ? "资源使用情况" : "Sử dụng tài nguyên"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceData.resourceUsage.map((resource, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#0e1a13]">{resource.resource}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0e1a13]">{resource.usage}%</span>
                    <Badge
                      variant={
                        resource.status === "good"
                          ? "default"
                          : resource.status === "normal"
                            ? "secondary"
                            : "destructive"
                      }
                      className={
                        resource.status === "good"
                          ? "bg-green-100 text-green-800"
                          : resource.status === "normal"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {resource.status}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={resource.usage}
                  className={`h-2 ${resource.status === "warning" ? "[&>div]:bg-yellow-500" : ""}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card className="border-[#d1e6d9]">
        <CardHeader>
          <CardTitle className="text-[#0e1a13] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {language === "en" ? "Recent Incidents" : language === "zh" ? "最近事件" : "Sự cố gần đây"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.incidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      incident.status === "resolved"
                        ? "bg-green-500"
                        : incident.status === "investigating"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                  <div>
                    <h4 className="font-semibold text-[#0e1a13]">{incident.title}</h4>
                    <p className="text-sm text-[#51946b]">
                      {incident.time} • Duration: {incident.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                  <Badge
                    variant={incident.status === "resolved" ? "default" : "secondary"}
                    className={
                      incident.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {incident.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
