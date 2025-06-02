'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Clock, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { performanceMonitor } from '@/lib/model-utils'

interface ModelPerformanceMonitorProps {
  isActive?: boolean
  className?: string
}

interface PerformanceData {
  timestamp: number
  fps: number
  frameTime: number
  memoryUsage: number
  drawCalls: number
  triangles: number
}

interface PerformanceStats {
  current: PerformanceData
  average: PerformanceData
  peak: PerformanceData
  history: PerformanceData[]
}

export function ModelPerformanceMonitor({ 
  isActive = true, 
  className = '' 
}: ModelPerformanceMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(isActive)
  const [stats, setStats] = useState<PerformanceStats>({
    current: {
      timestamp: Date.now(),
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      drawCalls: 0,
      triangles: 0
    },
    average: {
      timestamp: Date.now(),
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      drawCalls: 0,
      triangles: 0
    },
    peak: {
      timestamp: Date.now(),
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      drawCalls: 0,
      triangles: 0
    },
    history: []
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const fpsHistoryRef = useRef<number[]>([])
  
  // Performance monitoring function
  const updatePerformanceStats = () => {
    const now = performance.now()
    const deltaTime = now - lastTimeRef.current
    
    if (deltaTime >= 1000) { // Update every second
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime)
      const frameTime = deltaTime / frameCountRef.current
      
      // Get memory usage (approximation)
      const memoryUsage = (performance as any).memory ? 
        (performance as any).memory.usedJSHeapSize : 0
      
      // Get performance metrics from our monitor
      const metrics = performanceMonitor.getMetrics()
      
      const currentData: PerformanceData = {
        timestamp: Date.now(),
        fps,
        frameTime,
        memoryUsage,
        drawCalls: 0, // Would need WebGL context to get actual draw calls
        triangles: 0  // Would need scene analysis
      }
      
      setStats(prevStats => {
        const newHistory = [...prevStats.history, currentData].slice(-60) // Keep last 60 seconds
        
        // Calculate averages
        const avgFps = newHistory.reduce((sum, data) => sum + data.fps, 0) / newHistory.length
        const avgFrameTime = newHistory.reduce((sum, data) => sum + data.frameTime, 0) / newHistory.length
        const avgMemory = newHistory.reduce((sum, data) => sum + data.memoryUsage, 0) / newHistory.length
        
        // Find peaks
        const peakFps = Math.max(...newHistory.map(data => data.fps))
        const peakFrameTime = Math.max(...newHistory.map(data => data.frameTime))
        const peakMemory = Math.max(...newHistory.map(data => data.memoryUsage))
        
        return {
          current: currentData,
          average: {
            timestamp: Date.now(),
            fps: Math.round(avgFps),
            frameTime: Math.round(avgFrameTime * 100) / 100,
            memoryUsage: Math.round(avgMemory),
            drawCalls: 0,
            triangles: 0
          },
          peak: {
            timestamp: Date.now(),
            fps: peakFps,
            frameTime: peakFrameTime,
            memoryUsage: peakMemory,
            drawCalls: 0,
            triangles: 0
          },
          history: newHistory
        }
      })
      
      frameCountRef.current = 0
      lastTimeRef.current = now
    }
    
    frameCountRef.current++
  }
  
  // Start/stop monitoring
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(updatePerformanceStats, 16) // ~60fps
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMonitoring])
  
  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }
  
  const resetStats = () => {
    setStats({
      current: {
        timestamp: Date.now(),
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        drawCalls: 0,
        triangles: 0
      },
      average: {
        timestamp: Date.now(),
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        drawCalls: 0,
        triangles: 0
      },
      peak: {
        timestamp: Date.now(),
        fps: 60,
        frameTime: 16.67,
        memoryUsage: 0,
        drawCalls: 0,
        triangles: 0
      },
      history: []
    })
    frameCountRef.current = 0
    lastTimeRef.current = performance.now()
  }
  
  const getPerformanceColor = (value: number, thresholds: { good: number, warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600'
    if (value >= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getFpsColor = (fps: number) => getPerformanceColor(fps, { good: 50, warning: 30 })
  const getFrameTimeColor = (frameTime: number) => {
    if (frameTime <= 20) return 'text-green-600'
    if (frameTime <= 33) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const formatMemory = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getTrend = (current: number, average: number) => {
    const diff = ((current - average) / average) * 100
    if (Math.abs(diff) < 5) return { icon: Minus, color: 'text-gray-500' }
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-600' }
    return { icon: TrendingDown, color: 'text-red-600' }
  }
  
  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Monitor
              {isMonitoring && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Live
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Real-time 3D rendering performance metrics
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetStats}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant={isMonitoring ? "default" : "outline"}
              size="sm"
              onClick={toggleMonitoring}
              className={isMonitoring ? "bg-[#39e079] hover:bg-[#51946b] text-[#0e1a13]" : ""}
            >
              {isMonitoring ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FPS Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Frame Rate
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current FPS:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getFpsColor(stats.current.fps)}`}>
                    {stats.current.fps}
                  </span>
                  {(() => {
                    const trend = getTrend(stats.current.fps, stats.average.fps)
                    const TrendIcon = trend.icon
                    return <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  })()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Average:</span>
                <span className={`font-medium ${getFpsColor(stats.average.fps)}`}>
                  {stats.average.fps} FPS
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak:</span>
                <span className={`font-medium ${getFpsColor(stats.peak.fps)}`}>
                  {stats.peak.fps} FPS
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance:</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.current.fps >= 50 ? 'Excellent' : 
                     stats.current.fps >= 30 ? 'Good' : 'Poor'}
                  </span>
                </div>
                <Progress 
                  value={Math.min((stats.current.fps / 60) * 100, 100)} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
          
          {/* Frame Time Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Frame Time
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getFrameTimeColor(stats.current.frameTime)}`}>
                    {stats.current.frameTime.toFixed(1)}ms
                  </span>
                  {(() => {
                    const trend = getTrend(stats.current.frameTime, stats.average.frameTime)
                    const TrendIcon = trend.icon
                    return <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  })()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Average:</span>
                <span className={`font-medium ${getFrameTimeColor(stats.average.frameTime)}`}>
                  {stats.average.frameTime.toFixed(1)}ms
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak:</span>
                <span className={`font-medium ${getFrameTimeColor(stats.peak.frameTime)}`}>
                  {stats.peak.frameTime.toFixed(1)}ms
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Target:</span>
                  <span className="text-sm text-muted-foreground">16.67ms (60 FPS)</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - ((stats.current.frameTime / 33.33) * 100))} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
          
          {/* Memory Usage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Memory Usage
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {formatMemory(stats.current.memoryUsage)}
                  </span>
                  {(() => {
                    const trend = getTrend(stats.current.memoryUsage, stats.average.memoryUsage)
                    const TrendIcon = trend.icon
                    return <TrendIcon className={`w-4 h-4 ${trend.color}`} />
                  })()}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Average:</span>
                <span className="font-medium">
                  {formatMemory(stats.average.memoryUsage)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak:</span>
                <span className="font-medium">
                  {formatMemory(stats.peak.memoryUsage)}
                </span>
              </div>
              
              {stats.peak.memoryUsage > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usage:</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((stats.current.memoryUsage / stats.peak.memoryUsage) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(stats.current.memoryUsage / stats.peak.memoryUsage) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* System Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              System Info
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Monitoring:</span>
                <Badge variant={isMonitoring ? "default" : "secondary"}>
                  {isMonitoring ? 'Active' : 'Paused'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Samples:</span>
                <span className="font-medium">{stats.history.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Duration:</span>
                <span className="font-medium">
                  {Math.round(stats.history.length / 60 * 100) / 100}min
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Updates every ~16ms (60 FPS)</p>
                <p>• Keeps last 60 seconds of data</p>
                <p>• Memory usage from JS heap</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance History Chart (Simple) */}
        {stats.history.length > 10 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Performance History</h3>
            <div className="h-20 bg-muted rounded-lg p-4 flex items-end justify-between gap-1">
              {stats.history.slice(-30).map((data, index) => {
                const height = Math.max(4, (data.fps / 60) * 100)
                const color = data.fps >= 50 ? 'bg-green-500' : 
                             data.fps >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                return (
                  <div
                    key={index}
                    className={`w-2 ${color} rounded-sm`}
                    style={{ height: `${Math.min(height, 100)}%` }}
                    title={`${data.fps} FPS at ${new Date(data.timestamp).toLocaleTimeString()}`}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30s ago</span>
              <span>Now</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ModelPerformanceMonitor