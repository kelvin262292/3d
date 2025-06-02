'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  HardDrive,
  Cpu,
  Zap,
  Eye,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  PieChart,
  LineChart,
  Target,
  Gauge
} from 'lucide-react'
import { ModelPerformanceMonitor } from '@/lib/model-utils'

interface ModelMetrics {
  id: string
  name: string
  category: string
  loadTime: number
  renderTime: number
  memoryUsage: number
  triangles: number
  vertices: number
  materials: number
  textures: number
  fileSize: number
  complexity: 'low' | 'medium' | 'high'
  fps: number
  drawCalls: number
  timestamp: number
}

interface PerformanceThresholds {
  loadTime: { good: number; warning: number }
  renderTime: { good: number; warning: number }
  memoryUsage: { good: number; warning: number }
  fps: { good: number; warning: number }
  fileSize: { good: number; warning: number }
}

interface ModelAnalyticsProps {
  metrics: ModelMetrics[]
  onRefresh?: () => void
  className?: string
}

const defaultThresholds: PerformanceThresholds = {
  loadTime: { good: 2000, warning: 5000 }, // ms
  renderTime: { good: 16, warning: 33 }, // ms (60fps = 16ms, 30fps = 33ms)
  memoryUsage: { good: 50, warning: 100 }, // MB
  fps: { good: 60, warning: 30 },
  fileSize: { good: 5, warning: 20 } // MB
}

export function ModelAnalytics({ 
  metrics = [], 
  onRefresh,
  className = '' 
}: ModelAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [thresholds] = useState<PerformanceThresholds>(defaultThresholds)
  
  // Filter metrics based on time range and category
  const filteredMetrics = useMemo(() => {
    const now = Date.now()
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }
    
    return metrics.filter(metric => {
      const timeFilter = now - metric.timestamp <= timeRanges[selectedTimeRange]
      const categoryFilter = selectedCategory === 'all' || metric.category === selectedCategory
      return timeFilter && categoryFilter
    })
  }, [metrics, selectedTimeRange, selectedCategory])
  
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (filteredMetrics.length === 0) {
      return {
        totalModels: 0,
        avgLoadTime: 0,
        avgRenderTime: 0,
        avgMemoryUsage: 0,
        avgFps: 0,
        totalFileSize: 0,
        performanceScore: 0
      }
    }
    
    const totalModels = filteredMetrics.length
    const avgLoadTime = filteredMetrics.reduce((sum, m) => sum + m.loadTime, 0) / totalModels
    const avgRenderTime = filteredMetrics.reduce((sum, m) => sum + m.renderTime, 0) / totalModels
    const avgMemoryUsage = filteredMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / totalModels
    const avgFps = filteredMetrics.reduce((sum, m) => sum + m.fps, 0) / totalModels
    const totalFileSize = filteredMetrics.reduce((sum, m) => sum + m.fileSize, 0)
    
    // Calculate performance score (0-100)
    const loadTimeScore = Math.max(0, 100 - (avgLoadTime / thresholds.loadTime.warning) * 100)
    const renderTimeScore = Math.max(0, 100 - (avgRenderTime / thresholds.renderTime.warning) * 100)
    const memoryScore = Math.max(0, 100 - (avgMemoryUsage / thresholds.memoryUsage.warning) * 100)
    const fpsScore = Math.min(100, (avgFps / thresholds.fps.good) * 100)
    const performanceScore = (loadTimeScore + renderTimeScore + memoryScore + fpsScore) / 4
    
    return {
      totalModels,
      avgLoadTime,
      avgRenderTime,
      avgMemoryUsage,
      avgFps,
      totalFileSize,
      performanceScore
    }
  }, [filteredMetrics, thresholds])
  
  // Get categories for filter
  const categories = useMemo(() => {
    const cats = Array.from(new Set(metrics.map(m => m.category)))
    return ['all', ...cats]
  }, [metrics])
  
  // Performance status helpers
  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }, higherIsBetter = false) => {
    if (higherIsBetter) {
      if (value >= thresholds.good) return 'good'
      if (value >= thresholds.warning) return 'warning'
      return 'poor'
    } else {
      if (value <= thresholds.good) return 'good'
      if (value <= thresholds.warning) return 'warning'
      return 'poor'
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'poor': return <AlertTriangle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }
  
  // Generate trend data (simplified)
  const generateTrendData = (metricKey: keyof ModelMetrics) => {
    const sortedMetrics = [...filteredMetrics].sort((a, b) => a.timestamp - b.timestamp)
    return sortedMetrics.map((metric, index) => ({
      x: index,
      y: metric[metricKey] as number,
      timestamp: metric.timestamp
    }))
  }
  
  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      category: selectedCategory,
      summary: summaryStats,
      thresholds,
      metrics: filteredMetrics,
      analysis: {
        topPerformers: filteredMetrics
          .sort((a, b) => b.fps - a.fps)
          .slice(0, 5)
          .map(m => ({ name: m.name, fps: m.fps, loadTime: m.loadTime })),
        bottlenecks: filteredMetrics
          .filter(m => 
            m.loadTime > thresholds.loadTime.warning ||
            m.renderTime > thresholds.renderTime.warning ||
            m.memoryUsage > thresholds.memoryUsage.warning
          )
          .map(m => ({ 
            name: m.name, 
            issues: [
              m.loadTime > thresholds.loadTime.warning && 'Slow loading',
              m.renderTime > thresholds.renderTime.warning && 'Poor render performance',
              m.memoryUsage > thresholds.memoryUsage.warning && 'High memory usage'
            ].filter(Boolean)
          })),
        recommendations: [
          summaryStats.avgLoadTime > thresholds.loadTime.good && 'Consider optimizing model complexity or implementing progressive loading',
          summaryStats.avgMemoryUsage > thresholds.memoryUsage.good && 'Implement texture compression and LOD systems',
          summaryStats.avgFps < thresholds.fps.good && 'Review rendering pipeline and consider frustum culling'
        ].filter(Boolean)
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `model-analytics-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className={`w-full max-w-7xl space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Model Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Performance metrics and insights for 3D models
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportReport}
                disabled={filteredMetrics.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <div className="flex gap-1">
              <span className="text-sm font-medium mr-2">Time Range:</span>
              {(['1h', '24h', '7d', '30d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-1">
              <span className="text-sm font-medium mr-2">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold">{summaryStats.totalModels}</p>
              </div>
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Load Time</p>
                <p className="text-2xl font-bold">{formatDuration(summaryStats.avgLoadTime)}</p>
                <Badge className={`mt-1 ${getStatusColor(getPerformanceStatus(summaryStats.avgLoadTime, thresholds.loadTime))}`}>
                  {getStatusIcon(getPerformanceStatus(summaryStats.avgLoadTime, thresholds.loadTime))}
                  {getPerformanceStatus(summaryStats.avgLoadTime, thresholds.loadTime)}
                </Badge>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg FPS</p>
                <p className="text-2xl font-bold">{Math.round(summaryStats.avgFps)}</p>
                <Badge className={`mt-1 ${getStatusColor(getPerformanceStatus(summaryStats.avgFps, thresholds.fps, true))}`}>
                  {getStatusIcon(getPerformanceStatus(summaryStats.avgFps, thresholds.fps, true))}
                  {getPerformanceStatus(summaryStats.avgFps, thresholds.fps, true)}
                </Badge>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                <p className="text-2xl font-bold">{Math.round(summaryStats.performanceScore)}/100</p>
                <Progress value={summaryStats.performanceScore} className="mt-2 h-2" />
              </div>
              <Gauge className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Load Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['good', 'warning', 'poor'].map((status) => {
                        const count = filteredMetrics.filter(m => 
                          getPerformanceStatus(m.loadTime, thresholds.loadTime) === status
                        ).length
                        const percentage = filteredMetrics.length > 0 ? (count / filteredMetrics.length) * 100 : 0
                        
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                status === 'good' ? 'bg-green-500' :
                                status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="capitalize">{status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{count}</span>
                              <div className="w-20">
                                <Progress value={percentage} className="h-2" />
                              </div>
                              <span className="text-sm font-medium w-12">{Math.round(percentage)}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Average</span>
                        <span className="text-sm">{summaryStats.avgMemoryUsage.toFixed(1)} MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Peak</span>
                        <span className="text-sm">
                          {Math.max(...filteredMetrics.map(m => m.memoryUsage)).toFixed(1)} MB
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total File Size</span>
                        <span className="text-sm">{formatFileSize(summaryStats.totalFileSize)}</span>
                      </div>
                      <Progress 
                        value={(summaryStats.avgMemoryUsage / thresholds.memoryUsage.warning) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="models">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredMetrics.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No metrics available for the selected filters</p>
                    </div>
                  ) : (
                    filteredMetrics
                      .sort((a, b) => b.fps - a.fps)
                      .map((metric) => (
                        <Card key={metric.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium">{metric.name}</h4>
                                <p className="text-sm text-muted-foreground">{metric.category}</p>
                              </div>
                              <Badge className={getStatusColor(
                                getPerformanceStatus(metric.fps, thresholds.fps, true)
                              )}>
                                {metric.fps.toFixed(1)} FPS
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Load Time</p>
                                <p className="font-medium">{formatDuration(metric.loadTime)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Memory</p>
                                <p className="font-medium">{metric.memoryUsage.toFixed(1)} MB</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Triangles</p>
                                <p className="font-medium">{metric.triangles.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">File Size</p>
                                <p className="font-medium">{formatFileSize(metric.fileSize)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Trends</CardTitle>
                    <CardDescription>
                      Simplified trend visualization (in a real implementation, use a charting library)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Load Time Trend</h4>
                        <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Chart: Load time over time
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">FPS Trend</h4>
                        <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Chart: FPS over time
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Top Performers */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Top Performers
                      </h4>
                      <div className="space-y-2">
                        {filteredMetrics
                          .sort((a, b) => b.fps - a.fps)
                          .slice(0, 3)
                          .map((metric, index) => (
                            <div key={metric.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <span className="text-sm font-medium">#{index + 1} {metric.name}</span>
                              <span className="text-sm text-green-700">{metric.fps.toFixed(1)} FPS</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    {/* Bottlenecks */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        Performance Bottlenecks
                      </h4>
                      <div className="space-y-2">
                        {filteredMetrics
                          .filter(m => 
                            m.loadTime > thresholds.loadTime.warning ||
                            m.renderTime > thresholds.renderTime.warning ||
                            m.memoryUsage > thresholds.memoryUsage.warning
                          )
                          .slice(0, 3)
                          .map((metric) => (
                            <div key={metric.id} className="p-3 bg-red-50 border border-red-200 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-red-800">{metric.name}</span>
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              </div>
                              <div className="text-sm text-red-700">
                                Issues: {[
                                  metric.loadTime > thresholds.loadTime.warning && 'Slow loading',
                                  metric.renderTime > thresholds.renderTime.warning && 'Poor render performance',
                                  metric.memoryUsage > thresholds.memoryUsage.warning && 'High memory usage'
                                ].filter(Boolean).join(', ')}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        Optimization Recommendations
                      </h4>
                      <div className="space-y-2">
                        {[
                          summaryStats.avgLoadTime > thresholds.loadTime.good && {
                            title: 'Optimize Loading Performance',
                            description: 'Consider implementing progressive loading, model compression, or LOD systems'
                          },
                          summaryStats.avgMemoryUsage > thresholds.memoryUsage.good && {
                            title: 'Reduce Memory Usage',
                            description: 'Implement texture compression, geometry optimization, and efficient caching'
                          },
                          summaryStats.avgFps < thresholds.fps.good && {
                            title: 'Improve Render Performance',
                            description: 'Review rendering pipeline, implement frustum culling, and optimize shaders'
                          }
                        ].filter(Boolean).map((rec, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <h5 className="font-medium text-blue-800 mb-1">{rec.title}</h5>
                            <p className="text-sm text-blue-700">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default ModelAnalytics