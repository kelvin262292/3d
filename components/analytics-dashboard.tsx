'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Smartphone, 
  Monitor, 
  Tablet,
  Globe,
  Zap,
  Download,
  Upload,
  Activity,
  Target,
  MousePointer,
  RefreshCw,
  Calendar,
  Filter,
  Share2
} from 'lucide-react'

interface AnalyticsData {
  timestamp: Date
  pageViews: number
  uniqueVisitors: number
  sessionDuration: number
  bounceRate: number
  conversionRate: number
  modelViews: number
  modelInteractions: number
  deviceBreakdown: {
    mobile: number
    tablet: number
    desktop: number
  }
  browserBreakdown: {
    chrome: number
    firefox: number
    safari: number
    edge: number
    other: number
  }
  geographicData: {
    country: string
    visitors: number
    percentage: number
  }[]
  performanceMetrics: {
    loadTime: number
    renderTime: number
    interactionTime: number
    errorRate: number
  }
  popularModels: {
    name: string
    views: number
    interactions: number
    avgViewTime: number
  }[]
  userJourney: {
    step: string
    users: number
    dropoffRate: number
  }[]
}

interface RealTimeMetrics {
  activeUsers: number
  currentPageViews: number
  avgLoadTime: number
  errorCount: number
  topPages: {
    path: string
    views: number
  }[]
  recentEvents: {
    type: 'pageview' | 'interaction' | 'error' | 'conversion'
    timestamp: Date
    details: string
  }[]
}

// Mock data generator
function generateMockAnalytics(): AnalyticsData {
  const now = new Date()
  return {
    timestamp: now,
    pageViews: Math.floor(Math.random() * 10000) + 5000,
    uniqueVisitors: Math.floor(Math.random() * 3000) + 1500,
    sessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
    bounceRate: Math.random() * 0.4 + 0.3, // 30-70%
    conversionRate: Math.random() * 0.1 + 0.02, // 2-12%
    modelViews: Math.floor(Math.random() * 5000) + 2000,
    modelInteractions: Math.floor(Math.random() * 2000) + 800,
    deviceBreakdown: {
      mobile: Math.random() * 0.5 + 0.3,
      tablet: Math.random() * 0.2 + 0.1,
      desktop: Math.random() * 0.4 + 0.3
    },
    browserBreakdown: {
      chrome: Math.random() * 0.4 + 0.4,
      firefox: Math.random() * 0.2 + 0.1,
      safari: Math.random() * 0.2 + 0.1,
      edge: Math.random() * 0.15 + 0.05,
      other: Math.random() * 0.1 + 0.05
    },
    geographicData: [
      { country: 'United States', visitors: Math.floor(Math.random() * 1000) + 500, percentage: 0 },
      { country: 'United Kingdom', visitors: Math.floor(Math.random() * 500) + 200, percentage: 0 },
      { country: 'Germany', visitors: Math.floor(Math.random() * 400) + 150, percentage: 0 },
      { country: 'France', visitors: Math.floor(Math.random() * 300) + 100, percentage: 0 },
      { country: 'Japan', visitors: Math.floor(Math.random() * 250) + 80, percentage: 0 }
    ].map(item => ({ ...item, percentage: item.visitors / 2000 })),
    performanceMetrics: {
      loadTime: Math.random() * 2000 + 500, // ms
      renderTime: Math.random() * 1000 + 200, // ms
      interactionTime: Math.random() * 100 + 50, // ms
      errorRate: Math.random() * 0.05 // 0-5%
    },
    popularModels: [
      { name: 'Modern Chair', views: Math.floor(Math.random() * 500) + 200, interactions: Math.floor(Math.random() * 200) + 80, avgViewTime: Math.random() * 60 + 30 },
      { name: 'Antique Camera', views: Math.floor(Math.random() * 400) + 150, interactions: Math.floor(Math.random() * 150) + 60, avgViewTime: Math.random() * 50 + 25 },
      { name: 'Damaged Helmet', views: Math.floor(Math.random() * 300) + 100, interactions: Math.floor(Math.random() * 100) + 40, avgViewTime: Math.random() * 40 + 20 },
      { name: 'Avocado', views: Math.floor(Math.random() * 250) + 80, interactions: Math.floor(Math.random() * 80) + 30, avgViewTime: Math.random() * 35 + 15 }
    ],
    userJourney: [
      { step: 'Landing Page', users: 1000, dropoffRate: 0.1 },
      { step: 'Browse Models', users: 900, dropoffRate: 0.15 },
      { step: 'View 3D Model', users: 765, dropoffRate: 0.2 },
      { step: 'Interact with Model', users: 612, dropoffRate: 0.25 },
      { step: 'Add to Wishlist', users: 459, dropoffRate: 0.3 },
      { step: 'Sign Up', users: 321, dropoffRate: 0.4 },
      { step: 'Complete Profile', users: 193, dropoffRate: 0.2 }
    ]
  }
}

function generateRealTimeMetrics(): RealTimeMetrics {
  return {
    activeUsers: Math.floor(Math.random() * 100) + 20,
    currentPageViews: Math.floor(Math.random() * 50) + 10,
    avgLoadTime: Math.random() * 1000 + 500,
    errorCount: Math.floor(Math.random() * 5),
    topPages: [
      { path: '/', views: Math.floor(Math.random() * 20) + 10 },
      { path: '/models', views: Math.floor(Math.random() * 15) + 8 },
      { path: '/model/chair', views: Math.floor(Math.random() * 12) + 5 },
      { path: '/auth/signin', views: Math.floor(Math.random() * 8) + 3 }
    ],
    recentEvents: [
      { type: 'pageview', timestamp: new Date(Date.now() - Math.random() * 60000), details: 'User viewed homepage' },
      { type: 'interaction', timestamp: new Date(Date.now() - Math.random() * 120000), details: 'User rotated 3D model' },
      { type: 'conversion', timestamp: new Date(Date.now() - Math.random() * 180000), details: 'User signed up' },
      { type: 'error', timestamp: new Date(Date.now() - Math.random() * 240000), details: 'Model loading failed' }
    ]
  }
}

// Analytics hook
function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [realTimeData, setRealTimeData] = useState<RealTimeMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setData(generateMockAnalytics())
    setIsLoading(false)
  }, [timeRange])
  
  const fetchRealTimeData = useCallback(() => {
    setRealTimeData(generateRealTimeMetrics())
  }, [])
  
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])
  
  useEffect(() => {
    fetchRealTimeData()
    const interval = setInterval(fetchRealTimeData, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [fetchRealTimeData])
  
  return {
    data,
    realTimeData,
    isLoading,
    timeRange,
    setTimeRange,
    refresh: fetchAnalytics
  }
}

// Metric card component
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  format = 'number',
  className = '' 
}: {
  title: string
  value: number
  change?: number
  icon: React.ComponentType<{ className?: string }>
  format?: 'number' | 'percentage' | 'duration' | 'bytes'
  className?: string
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`
      case 'duration':
        return val < 60 ? `${val.toFixed(0)}s` : `${(val / 60).toFixed(1)}m`
      case 'bytes':
        return val < 1024 ? `${val.toFixed(0)}B` : `${(val / 1024).toFixed(1)}KB`
      default:
        return val.toLocaleString()
    }
  }
  
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{formatValue(value)}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </Card>
  )
}

// Real-time metrics component
function RealTimeMetrics({ data }: { data: RealTimeMetrics }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={data.activeUsers}
          icon={Users}
          className="border-green-200 bg-green-50"
        />
        <MetricCard
          title="Page Views"
          value={data.currentPageViews}
          icon={Eye}
          className="border-blue-200 bg-blue-50"
        />
        <MetricCard
          title="Avg Load Time"
          value={data.avgLoadTime}
          icon={Zap}
          format="duration"
          className="border-yellow-200 bg-yellow-50"
        />
        <MetricCard
          title="Errors"
          value={data.errorCount}
          icon={Activity}
          className="border-red-200 bg-red-50"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Pages */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top Pages (Live)</h3>
          <div className="space-y-2">
            {data.topPages.map((page, index) => (
              <div key={page.path} className="flex justify-between items-center">
                <span className="text-sm font-mono">{page.path}</span>
                <Badge variant="outline">{page.views} views</Badge>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Recent Events */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Recent Events</h3>
          <div className="space-y-2">
            {data.recentEvents.map((event, index) => {
              const getEventIcon = () => {
                switch (event.type) {
                  case 'pageview': return <Eye className="w-3 h-3" />
                  case 'interaction': return <MousePointer className="w-3 h-3" />
                  case 'conversion': return <Target className="w-3 h-3" />
                  case 'error': return <Activity className="w-3 h-3" />
                }
              }
              
              const getEventColor = () => {
                switch (event.type) {
                  case 'pageview': return 'text-blue-600'
                  case 'interaction': return 'text-green-600'
                  case 'conversion': return 'text-purple-600'
                  case 'error': return 'text-red-600'
                }
              }
              
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className={getEventColor()}>
                    {getEventIcon()}
                  </div>
                  <span className="flex-1">{event.details}</span>
                  <span className="text-xs text-gray-500">
                    {Math.round((Date.now() - event.timestamp.getTime()) / 1000)}s ago
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Overview metrics component
function OverviewMetrics({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Page Views"
          value={data.pageViews}
          change={Math.random() * 20 - 10}
          icon={Eye}
        />
        <MetricCard
          title="Unique Visitors"
          value={data.uniqueVisitors}
          change={Math.random() * 15 - 5}
          icon={Users}
        />
        <MetricCard
          title="Session Duration"
          value={data.sessionDuration}
          change={Math.random() * 10 - 5}
          icon={Clock}
          format="duration"
        />
        <MetricCard
          title="Bounce Rate"
          value={data.bounceRate}
          change={Math.random() * 10 - 15}
          icon={TrendingDown}
          format="percentage"
        />
      </div>
      
      {/* 3D Model Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Model Views"
          value={data.modelViews}
          change={Math.random() * 25 - 5}
          icon={Eye}
        />
        <MetricCard
          title="Model Interactions"
          value={data.modelInteractions}
          change={Math.random() * 30 - 10}
          icon={MousePointer}
        />
        <MetricCard
          title="Conversion Rate"
          value={data.conversionRate}
          change={Math.random() * 20 - 10}
          icon={Target}
          format="percentage"
        />
      </div>
      
      {/* Device & Browser Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Device Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </div>
              <span className="font-medium">{(data.deviceBreakdown.mobile * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                <span>Tablet</span>
              </div>
              <span className="font-medium">{(data.deviceBreakdown.tablet * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </div>
              <span className="font-medium">{(data.deviceBreakdown.desktop * 100).toFixed(1)}%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top Countries</h3>
          <div className="space-y-2">
            {data.geographicData.slice(0, 5).map((country, index) => (
              <div key={country.country} className="flex justify-between items-center">
                <span className="text-sm">{country.country}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{country.visitors}</span>
                  <span className="text-xs text-gray-500">({(country.percentage * 100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Popular Models */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Popular 3D Models</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Model Name</th>
                <th className="text-right py-2">Views</th>
                <th className="text-right py-2">Interactions</th>
                <th className="text-right py-2">Avg View Time</th>
                <th className="text-right py-2">Engagement Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.popularModels.map((model, index) => (
                <tr key={model.name} className="border-b">
                  <td className="py-2 font-medium">{model.name}</td>
                  <td className="text-right py-2">{model.views.toLocaleString()}</td>
                  <td className="text-right py-2">{model.interactions.toLocaleString()}</td>
                  <td className="text-right py-2">{model.avgViewTime.toFixed(0)}s</td>
                  <td className="text-right py-2">
                    <Badge variant={model.interactions / model.views > 0.3 ? 'default' : 'secondary'}>
                      {((model.interactions / model.views) * 100).toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// Performance metrics component
function PerformanceMetrics({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Load Time"
          value={data.performanceMetrics.loadTime}
          icon={Download}
          format="duration"
        />
        <MetricCard
          title="Render Time"
          value={data.performanceMetrics.renderTime}
          icon={Activity}
          format="duration"
        />
        <MetricCard
          title="Interaction Time"
          value={data.performanceMetrics.interactionTime}
          icon={MousePointer}
          format="duration"
        />
        <MetricCard
          title="Error Rate"
          value={data.performanceMetrics.errorRate}
          icon={Activity}
          format="percentage"
        />
      </div>
      
      {/* User Journey Funnel */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">User Journey Funnel</h3>
        <div className="space-y-3">
          {data.userJourney.map((step, index) => {
            const width = (step.users / data.userJourney[0].users) * 100
            return (
              <div key={step.step} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span>{step.step}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{step.users.toLocaleString()}</span>
                    {index > 0 && (
                      <Badge variant="outline" className="text-xs">
                        -{(step.dropoffRate * 100).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// Main analytics dashboard
export function AnalyticsDashboard() {
  const { data, realTimeData, isLoading, timeRange, setTimeRange, refresh } = useAnalytics()
  
  const exportData = useCallback(() => {
    if (!data) return
    
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      timeRange
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [data, timeRange])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">Monitor your application's performance and user engagement</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          
          {data && (
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          
          <Button onClick={refresh} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <Tabs defaultValue="realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="realtime" className="space-y-4">
          {realTimeData ? (
            <RealTimeMetrics data={realTimeData} />
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading real-time data...</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-4">
          {data ? (
            <OverviewMetrics data={data} />
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          {data ? (
            <PerformanceMetrics data={data} />
          ) : (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading performance data...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsDashboard