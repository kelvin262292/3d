'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Activity, 
  Monitor, 
  Cpu, 
  MemoryStick, 
  HardDrive,
  Wifi,
  Battery,
  Smartphone,
  Settings,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Clock,
  Target,
  Gauge
} from 'lucide-react'

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  cpuUsage: number
  gpuUsage: number
  networkLatency: number
  loadTime: number
  renderTime: number
  triangleCount: number
  textureMemory: number
  drawCalls: number
  batteryLevel?: number
  connectionType: 'wifi' | '4g' | '3g' | 'slow-2g' | 'offline'
  deviceType: 'mobile' | 'tablet' | 'desktop'
  isLowEndDevice: boolean
}

interface OptimizationSettings {
  autoOptimize: boolean
  targetFPS: number
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra'
  enableLOD: boolean
  enableOcclusion: boolean
  enableFrustumCulling: boolean
  maxTextureSize: number
  shadowQuality: 'off' | 'low' | 'medium' | 'high'
  antiAliasing: 'off' | 'fxaa' | 'msaa2x' | 'msaa4x'
  enableCompression: boolean
  enableCaching: boolean
  adaptiveQuality: boolean
  powerSaveMode: boolean
}

interface OptimizationRecommendation {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'easy' | 'medium' | 'hard'
  action: () => void
  estimatedImprovement: string
}

// Performance monitoring hook
function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    
    const updateMetrics = () => {
      // Get device info
      const deviceType = window.innerWidth < 768 ? 'mobile' : 
                        window.innerWidth < 1024 ? 'tablet' : 'desktop'
      
      // Simulate performance metrics (in real app, these would come from actual monitoring)
      const newMetrics: PerformanceMetrics = {
        fps: Math.max(10, 60 - Math.random() * 20),
        frameTime: 16.67 + Math.random() * 10,
        memoryUsage: Math.random() * 100,
        cpuUsage: Math.random() * 80,
        gpuUsage: Math.random() * 90,
        networkLatency: Math.random() * 200 + 50,
        loadTime: Math.random() * 3000 + 1000,
        renderTime: Math.random() * 16 + 8,
        triangleCount: Math.floor(Math.random() * 100000) + 50000,
        textureMemory: Math.random() * 512 + 128,
        drawCalls: Math.floor(Math.random() * 200) + 50,
        batteryLevel: deviceType === 'mobile' ? Math.random() * 100 : undefined,
        connectionType: ['wifi', '4g', '3g'][Math.floor(Math.random() * 3)] as any,
        deviceType,
        isLowEndDevice: deviceType === 'mobile' && Math.random() > 0.7
      }
      
      setMetrics(newMetrics)
    }
    
    updateMetrics()
    intervalRef.current = setInterval(updateMetrics, 1000)
  }, [])
  
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring
  }
}

// Optimization recommendations generator
function useOptimizationRecommendations(metrics: PerformanceMetrics | null, settings: OptimizationSettings) {
  return useMemo(() => {
    if (!metrics) return []
    
    const recommendations: OptimizationRecommendation[] = []
    
    // FPS recommendations
    if (metrics.fps < settings.targetFPS) {
      recommendations.push({
        id: 'low-fps',
        type: 'critical',
        title: 'Low Frame Rate Detected',
        description: `Current FPS (${metrics.fps.toFixed(1)}) is below target (${settings.targetFPS})`,
        impact: 'high',
        effort: 'easy',
        action: () => console.log('Reducing quality level'),
        estimatedImprovement: '+15-25 FPS'
      })
    }
    
    // Memory recommendations
    if (metrics.memoryUsage > 80) {
      recommendations.push({
        id: 'high-memory',
        type: 'warning',
        title: 'High Memory Usage',
        description: `Memory usage at ${metrics.memoryUsage.toFixed(1)}%`,
        impact: 'medium',
        effort: 'medium',
        action: () => console.log('Enabling texture compression'),
        estimatedImprovement: '-30-50% memory'
      })
    }
    
    // Triangle count recommendations
    if (metrics.triangleCount > 75000) {
      recommendations.push({
        id: 'high-triangles',
        type: 'warning',
        title: 'High Triangle Count',
        description: `${metrics.triangleCount.toLocaleString()} triangles in scene`,
        impact: 'high',
        effort: 'medium',
        action: () => console.log('Enabling LOD system'),
        estimatedImprovement: '+10-20 FPS'
      })
    }
    
    // Mobile-specific recommendations
    if (metrics.deviceType === 'mobile') {
      if (metrics.batteryLevel && metrics.batteryLevel < 20) {
        recommendations.push({
          id: 'low-battery',
          type: 'critical',
          title: 'Low Battery Mode',
          description: 'Device battery is low, enable power saving',
          impact: 'high',
          effort: 'easy',
          action: () => console.log('Enabling power save mode'),
          estimatedImprovement: '+50% battery life'
        })
      }
      
      if (metrics.connectionType === '3g' || metrics.connectionType === 'slow-2g') {
        recommendations.push({
          id: 'slow-connection',
          type: 'warning',
          title: 'Slow Network Connection',
          description: 'Enable aggressive compression for slow networks',
          impact: 'medium',
          effort: 'easy',
          action: () => console.log('Enabling compression'),
          estimatedImprovement: '-60% load time'
        })
      }
    }
    
    // Draw call recommendations
    if (metrics.drawCalls > 150) {
      recommendations.push({
        id: 'high-drawcalls',
        type: 'info',
        title: 'High Draw Calls',
        description: `${metrics.drawCalls} draw calls detected`,
        impact: 'medium',
        effort: 'hard',
        action: () => console.log('Implementing batching'),
        estimatedImprovement: '+5-15 FPS'
      })
    }
    
    return recommendations
  }, [metrics, settings])
}

// Performance metrics display component
function PerformanceMetrics({ metrics }: { metrics: PerformanceMetrics }) {
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600'
    if (value >= thresholds.warning) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (value >= thresholds.warning) return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* FPS */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">FPS</span>
          </div>
          {getStatusIcon(metrics.fps, { good: 50, warning: 30 })}
        </div>
        <div className={`text-2xl font-bold ${getStatusColor(metrics.fps, { good: 50, warning: 30 })}`}>
          {metrics.fps.toFixed(1)}
        </div>
        <Progress value={Math.min(metrics.fps / 60 * 100, 100)} className="mt-2" />
      </Card>
      
      {/* Frame Time */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Frame Time</span>
          </div>
          {getStatusIcon(33.33 - metrics.frameTime, { good: 16.67, warning: 10 })}
        </div>
        <div className={`text-2xl font-bold ${getStatusColor(33.33 - metrics.frameTime, { good: 16.67, warning: 10 })}`}>
          {metrics.frameTime.toFixed(1)}ms
        </div>
        <Progress value={Math.min(metrics.frameTime / 33.33 * 100, 100)} className="mt-2" />
      </Card>
      
      {/* Memory Usage */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MemoryStick className="w-4 h-4" />
            <span className="font-medium">Memory</span>
          </div>
          {getStatusIcon(100 - metrics.memoryUsage, { good: 50, warning: 20 })}
        </div>
        <div className={`text-2xl font-bold ${getStatusColor(100 - metrics.memoryUsage, { good: 50, warning: 20 })}`}>
          {metrics.memoryUsage.toFixed(1)}%
        </div>
        <Progress value={metrics.memoryUsage} className="mt-2" />
      </Card>
      
      {/* CPU Usage */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span className="font-medium">CPU</span>
          </div>
          {getStatusIcon(100 - metrics.cpuUsage, { good: 50, warning: 20 })}
        </div>
        <div className={`text-2xl font-bold ${getStatusColor(100 - metrics.cpuUsage, { good: 50, warning: 20 })}`}>
          {metrics.cpuUsage.toFixed(1)}%
        </div>
        <Progress value={metrics.cpuUsage} className="mt-2" />
      </Card>
      
      {/* GPU Usage */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span className="font-medium">GPU</span>
          </div>
          {getStatusIcon(100 - metrics.gpuUsage, { good: 30, warning: 10 })}
        </div>
        <div className={`text-2xl font-bold ${getStatusColor(100 - metrics.gpuUsage, { good: 30, warning: 10 })}`}>
          {metrics.gpuUsage.toFixed(1)}%
        </div>
        <Progress value={metrics.gpuUsage} className="mt-2" />
      </Card>
      
      {/* Network Latency */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="font-medium">Latency</span>
          </div>
          {getStatusIcon(500 - metrics.networkLatency, { good: 400, warning: 200 })}
        </div>
        <div className={`text-2xl font-bold ${getStatusColor(500 - metrics.networkLatency, { good: 400, warning: 200 })}`}>
          {metrics.networkLatency.toFixed(0)}ms
        </div>
        <Progress value={Math.min(metrics.networkLatency / 500 * 100, 100)} className="mt-2" />
      </Card>
    </div>
  )
}

// Optimization settings component
function OptimizationSettings({ 
  settings, 
  onSettingsChange 
}: { 
  settings: OptimizationSettings
  onSettingsChange: (settings: OptimizationSettings) => void 
}) {
  const updateSetting = <K extends keyof OptimizationSettings>(
    key: K, 
    value: OptimizationSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value })
  }
  
  return (
    <div className="space-y-6">
      {/* Auto Optimization */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Auto Optimization</h3>
            <p className="text-sm text-gray-600">Automatically adjust settings based on performance</p>
          </div>
          <Switch 
            checked={settings.autoOptimize}
            onCheckedChange={(checked) => updateSetting('autoOptimize', checked)}
          />
        </div>
      </Card>
      
      {/* Target FPS */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Target FPS</h3>
            <p className="text-sm text-gray-600">Desired frame rate for optimization</p>
          </div>
          <div className="space-y-2">
            <Slider
              value={[settings.targetFPS]}
              onValueChange={([value]) => updateSetting('targetFPS', value)}
              min={30}
              max={120}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>30 FPS</span>
              <span className="font-medium">{settings.targetFPS} FPS</span>
              <span>120 FPS</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Quality Level */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Quality Level</h3>
            <p className="text-sm text-gray-600">Overall rendering quality</p>
          </div>
          <Select value={settings.qualityLevel} onValueChange={(value: any) => updateSetting('qualityLevel', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Best Performance)</SelectItem>
              <SelectItem value="medium">Medium (Balanced)</SelectItem>
              <SelectItem value="high">High (Best Quality)</SelectItem>
              <SelectItem value="ultra">Ultra (Maximum Quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      {/* Advanced Settings */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Advanced Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Level of Detail (LOD)</span>
              <p className="text-sm text-gray-600">Reduce detail for distant objects</p>
            </div>
            <Switch 
              checked={settings.enableLOD}
              onCheckedChange={(checked) => updateSetting('enableLOD', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Occlusion Culling</span>
              <p className="text-sm text-gray-600">Skip rendering hidden objects</p>
            </div>
            <Switch 
              checked={settings.enableOcclusion}
              onCheckedChange={(checked) => updateSetting('enableOcclusion', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Frustum Culling</span>
              <p className="text-sm text-gray-600">Skip rendering off-screen objects</p>
            </div>
            <Switch 
              checked={settings.enableFrustumCulling}
              onCheckedChange={(checked) => updateSetting('enableFrustumCulling', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Texture Compression</span>
              <p className="text-sm text-gray-600">Reduce texture memory usage</p>
            </div>
            <Switch 
              checked={settings.enableCompression}
              onCheckedChange={(checked) => updateSetting('enableCompression', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Adaptive Quality</span>
              <p className="text-sm text-gray-600">Automatically adjust quality based on performance</p>
            </div>
            <Switch 
              checked={settings.adaptiveQuality}
              onCheckedChange={(checked) => updateSetting('adaptiveQuality', checked)}
            />
          </div>
          
          {settings.deviceType === 'mobile' && (
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Power Save Mode</span>
                <p className="text-sm text-gray-600">Reduce performance to save battery</p>
              </div>
              <Switch 
                checked={settings.powerSaveMode}
                onCheckedChange={(checked) => updateSetting('powerSaveMode', checked)}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// Recommendations component
function RecommendationsPanel({ recommendations }: { recommendations: OptimizationRecommendation[] }) {
  const getTypeIcon = (type: OptimizationRecommendation['type']) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-600" />
    }
  }
  
  const getTypeColor = (type: OptimizationRecommendation['type']) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'info': return 'border-blue-200 bg-blue-50'
    }
  }
  
  if (recommendations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
        <h3 className="font-semibold text-lg mb-2">Performance Optimized!</h3>
        <p className="text-gray-600">No optimization recommendations at this time.</p>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.id} className={`p-4 ${getTypeColor(rec.type)}`}>
          <div className="flex items-start gap-3">
            {getTypeIcon(rec.type)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{rec.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.impact} impact
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {rec.effort} effort
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  Expected: {rec.estimatedImprovement}
                </span>
                <Button size="sm" onClick={rec.action}>
                  Apply Fix
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Main performance optimizer component
export function PerformanceOptimizer() {
  const { metrics, isMonitoring, startMonitoring, stopMonitoring } = usePerformanceMonitor()
  
  const [settings, setSettings] = useState<OptimizationSettings>({
    autoOptimize: true,
    targetFPS: 60,
    qualityLevel: 'medium',
    enableLOD: true,
    enableOcclusion: true,
    enableFrustumCulling: true,
    maxTextureSize: 1024,
    shadowQuality: 'medium',
    antiAliasing: 'fxaa',
    enableCompression: true,
    enableCaching: true,
    adaptiveQuality: true,
    powerSaveMode: false
  })
  
  const recommendations = useOptimizationRecommendations(metrics, settings)
  
  const exportReport = useCallback(() => {
    if (!metrics) return
    
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      settings,
      recommendations: recommendations.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        impact: r.impact,
        effort: r.effort,
        estimatedImprovement: r.estimatedImprovement
      }))
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [metrics, settings, recommendations])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Performance Optimizer
          </h2>
          <p className="text-gray-600">Monitor and optimize your 3D application performance</p>
        </div>
        
        <div className="flex items-center gap-2">
          {metrics && (
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
          
          <Button 
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? 'destructive' : 'default'}
          >
            {isMonitoring ? (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Performance Status */}
      {metrics && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Performance Status</h3>
            <div className="flex items-center gap-2">
              <Badge variant={metrics.fps >= 50 ? 'default' : metrics.fps >= 30 ? 'secondary' : 'destructive'}>
                {metrics.fps >= 50 ? 'Excellent' : metrics.fps >= 30 ? 'Good' : 'Poor'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {metrics.deviceType === 'mobile' && <Smartphone className="w-3 h-3" />}
                {metrics.deviceType === 'tablet' && <Tablet className="w-3 h-3" />}
                {metrics.deviceType === 'desktop' && <Monitor className="w-3 h-3" />}
                <span className="capitalize">{metrics.deviceType}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Tabs */}
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="space-y-4">
          {metrics ? (
            <PerformanceMetrics metrics={metrics} />
          ) : (
            <Card className="p-8 text-center">
              <Gauge className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-lg mb-2">Start Performance Monitoring</h3>
              <p className="text-gray-600 mb-4">Click "Start Monitoring" to begin tracking performance metrics</p>
              <Button onClick={startMonitoring}>
                <Activity className="w-4 h-4 mr-2" />
                Start Monitoring
              </Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <OptimizationSettings 
            settings={settings} 
            onSettingsChange={setSettings}
          />
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <RecommendationsPanel recommendations={recommendations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PerformanceOptimizer