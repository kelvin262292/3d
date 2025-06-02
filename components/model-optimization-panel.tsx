'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Settings, 
  Zap, 
  BarChart3, 
  Download, 
  Upload,
  RefreshCw,
  Eye,
  Layers,
  Cpu,
  HardDrive,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { modelCache, performanceMonitor, calculateModelComplexity } from '@/lib/model-utils'
import * as THREE from 'three'

interface ModelOptimizationPanelProps {
  scene?: THREE.Group | null
  onOptimizationChange?: (settings: OptimizationSettings) => void
  className?: string
}

interface OptimizationSettings {
  enableLOD: boolean
  enableCompression: boolean
  textureQuality: 'low' | 'medium' | 'high'
  geometryQuality: 'low' | 'medium' | 'high'
  enableInstancing: boolean
  enableFrustumCulling: boolean
  maxCacheSize: number
}

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  triangles: number
  cacheHitRate: number
}

export function ModelOptimizationPanel({ 
  scene, 
  onOptimizationChange,
  className = '' 
}: ModelOptimizationPanelProps) {
  const [settings, setSettings] = useState<OptimizationSettings>({
    enableLOD: true,
    enableCompression: true,
    textureQuality: 'medium',
    geometryQuality: 'medium',
    enableInstancing: false,
    enableFrustumCulling: true,
    maxCacheSize: 100
  })
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    triangles: 0,
    cacheHitRate: 0
  })
  
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [modelStats, setModelStats] = useState<any>(null)
  
  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const perfMetrics = performanceMonitor.getMetrics()
      const cacheStats = modelCache.getCacheStats()
      
      setMetrics({
        loadTime: perfMetrics.averageLoadTime,
        renderTime: perfMetrics.averageRenderTime,
        memoryUsage: perfMetrics.averageMemoryUsage,
        triangles: 0, // Will be updated when scene changes
        cacheHitRate: cacheStats.entries > 0 ? (cacheStats.utilization / 100) * cacheStats.entries : 0
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Calculate model statistics when scene changes
  useEffect(() => {
    if (scene) {
      const stats = calculateModelComplexity(scene)
      setModelStats(stats)
      setMetrics(prev => ({ ...prev, triangles: stats.triangles }))
    }
  }, [scene])
  
  const handleSettingChange = (key: keyof OptimizationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onOptimizationChange?.(newSettings)
  }
  
  const handleOptimize = async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)
    
    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      setOptimizationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setIsOptimizing(false)
  }
  
  const clearCache = () => {
    modelCache.clear()
  }
  
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'low': return 'bg-yellow-500'
      case 'medium': return 'bg-blue-500'
      case 'high': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }
  
  return (
    <Card className={`w-full max-w-4xl ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              3D Model Optimization
            </CardTitle>
            <CardDescription>
              Configure optimization settings for better performance
            </CardDescription>
          </div>
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-[#39e079] hover:bg-[#51946b] text-[#0e1a13]"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize
              </>
            )}
          </Button>
        </div>
        
        {isOptimizing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Optimization Progress</span>
              <span className="text-sm text-muted-foreground">{optimizationProgress}%</span>
            </div>
            <Progress value={optimizationProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
          </TabsList>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quality Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Quality Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Texture Quality
                    </Label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((quality) => (
                        <Button
                          key={quality}
                          variant={settings.textureQuality === quality ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSettingChange('textureQuality', quality)}
                          className={settings.textureQuality === quality ? getQualityColor(quality) : ''}
                        >
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Geometry Quality
                    </Label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((quality) => (
                        <Button
                          key={quality}
                          variant={settings.geometryQuality === quality ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSettingChange('geometryQuality', quality)}
                          className={settings.geometryQuality === quality ? getQualityColor(quality) : ''}
                        >
                          {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Optimization Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Optimization Features
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Level of Detail (LOD)</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically reduce detail at distance
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableLOD}
                      onCheckedChange={(checked) => handleSettingChange('enableLOD', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">DRACO Compression</Label>
                      <p className="text-xs text-muted-foreground">
                        Compress geometry for faster loading
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableCompression}
                      onCheckedChange={(checked) => handleSettingChange('enableCompression', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Frustum Culling</Label>
                      <p className="text-xs text-muted-foreground">
                        Hide objects outside camera view
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableFrustumCulling}
                      onCheckedChange={(checked) => handleSettingChange('enableFrustumCulling', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Instancing</Label>
                      <p className="text-xs text-muted-foreground">
                        Reuse geometry for multiple objects
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableInstancing}
                      onCheckedChange={(checked) => handleSettingChange('enableInstancing', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cache Size Setting */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Cache Settings
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Max Cache Size</Label>
                  <span className="text-sm text-muted-foreground">{settings.maxCacheSize} MB</span>
                </div>
                <Slider
                  value={[settings.maxCacheSize]}
                  onValueChange={([value]) => handleSettingChange('maxCacheSize', value)}
                  max={500}
                  min={50}
                  step={25}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Model Stats */}
              {modelStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Current Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Triangles:</span>
                      <Badge variant="outline">{modelStats.triangles.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vertices:</span>
                      <Badge variant="outline">{modelStats.vertices.toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Materials:</span>
                      <Badge variant="outline">{modelStats.materials}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Textures:</span>
                      <Badge variant="outline">{modelStats.textures}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Complexity:</span>
                      <Badge 
                        variant="outline" 
                        className={getComplexityColor(modelStats.complexity)}
                      >
                        {modelStats.complexity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Load Time:
                    </span>
                    <Badge variant="outline">{Math.round(metrics.loadTime)}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Render Time:
                    </span>
                    <Badge variant="outline">{Math.round(metrics.renderTime)}ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      Memory Usage:
                    </span>
                    <Badge variant="outline">{Math.round(metrics.memoryUsage / 1024 / 1024)}MB</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Triangles:
                    </span>
                    <Badge variant="outline">{metrics.triangles.toLocaleString()}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Performance Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modelStats?.complexity === 'high' && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">High Complexity Model</p>
                        <p className="text-xs text-yellow-700">
                          Consider enabling LOD and reducing texture quality for better performance.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {metrics.loadTime > 3000 && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Slow Loading</p>
                        <p className="text-xs text-red-700">
                          Enable DRACO compression and reduce model complexity.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {settings.enableLOD && settings.enableCompression && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Optimized Configuration</p>
                        <p className="text-xs text-green-700">
                          Your settings are optimized for good performance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Cache Tab */}
          <TabsContent value="cache" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cache Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Cache Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cached Models:</span>
                    <Badge variant="outline">{modelCache.getCacheStats().entries}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cache Size:</span>
                    <Badge variant="outline">
                      {Math.round(modelCache.getCacheStats().currentSize / 1024 / 1024)}MB
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Utilization:</span>
                    <Badge variant="outline">
                      {Math.round(modelCache.getCacheStats().utilization)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hit Rate:</span>
                    <Badge variant="outline">
                      {Math.round(metrics.cacheHitRate * 100)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cache Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Cache Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={clearCache}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>• Cache automatically manages memory usage</p>
                    <p>• Older models are removed when cache is full</p>
                    <p>• Clearing cache will reload all models</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ModelOptimizationPanel