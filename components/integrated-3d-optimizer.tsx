'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stats, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet,
  Download,
  Upload,
  Zap,
  Eye,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

// Types
interface ModelData {
  id: string
  name: string
  url: string
  thumbnail: string
  category: string
  size: number
  triangles: number
  textures: number
  quality: 'low' | 'medium' | 'high'
}

interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage: number
  cpuUsage: number
  gpuUsage: number
  networkLatency: number
  batteryLevel?: number
  connectionType: string
}

interface OptimizationSettings {
  autoOptimize: boolean
  targetFPS: number
  qualityLevel: 'low' | 'medium' | 'high' | 'auto'
  enableLOD: boolean
  enableCulling: boolean
  textureCompression: boolean
  shadowQuality: 'off' | 'low' | 'medium' | 'high'
  antiAliasing: boolean
  deviceOptimization: boolean
}

// Device Detection Hook
const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    isMobile: false,
    isTablet: false,
    screenSize: { width: 1920, height: 1080 },
    pixelRatio: 1,
    touchSupport: false,
    batteryLevel: 100,
    connectionType: 'wifi'
  })

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i.test(userAgent)
      
      setDeviceInfo({
        type: isMobile ? (isTablet ? 'tablet' : 'mobile') : 'desktop',
        isMobile,
        isTablet,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        pixelRatio: window.devicePixelRatio || 1,
        touchSupport: 'ontouchstart' in window,
        batteryLevel: 100, // Would use Battery API if available
        connectionType: (navigator as any).connection?.effectiveType || 'wifi'
      })
    }

    detectDevice()
    window.addEventListener('resize', detectDevice)
    return () => window.removeEventListener('resize', detectDevice)
  }, [])

  return deviceInfo
}

// Performance Monitor Hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    cpuUsage: 0,
    gpuUsage: 0,
    networkLatency: 0,
    connectionType: 'wifi'
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measurePerformance = () => {
      const currentTime = performance.now()
      frameCount++
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        const frameTime = (currentTime - lastTime) / frameCount
        
        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime,
          memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
          cpuUsage: Math.random() * 30 + 10, // Simulated
          gpuUsage: Math.random() * 40 + 20, // Simulated
          networkLatency: Math.random() * 50 + 10 // Simulated
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measurePerformance)
    }

    measurePerformance()
    return () => cancelAnimationFrame(animationId)
  }, [])

  return metrics
}

// Optimized 3D Model Component
const OptimizedModel: React.FC<{
  modelData: ModelData
  settings: OptimizationSettings
  deviceInfo: any
  onLoad?: () => void
}> = ({ modelData, settings, deviceInfo, onLoad }) => {
  const { scene } = useGLTF(modelData.url)
  const modelRef = useRef<any>()
  const { camera, gl } = useThree()

  // Auto-rotation
  useFrame((state, delta) => {
    if (modelRef.current && settings.autoOptimize) {
      modelRef.current.rotation.y += delta * 0.5
    }
  })

  // Apply optimizations based on device and settings
  useEffect(() => {
    if (!scene) return

    scene.traverse((child: any) => {
      if (child.isMesh) {
        // LOD optimization
        if (settings.enableLOD && deviceInfo.isMobile) {
          child.geometry.attributes.position.array = child.geometry.attributes.position.array.slice(0, 
            Math.floor(child.geometry.attributes.position.array.length * 0.7)
          )
        }

        // Material optimization
        if (child.material) {
          if (deviceInfo.isMobile) {
            child.material.precision = 'lowp'
            child.castShadow = false
            child.receiveShadow = false
          }

          // Texture compression
          if (settings.textureCompression && child.material.map) {
            child.material.map.generateMipmaps = false
            child.material.map.minFilter = THREE.LinearFilter
          }
        }
      }
    })

    // Renderer optimizations
    if (deviceInfo.isMobile) {
      gl.setPixelRatio(Math.min(deviceInfo.pixelRatio, 2))
      gl.antialias = false
    }

    onLoad?.()
  }, [scene, settings, deviceInfo, gl, onLoad])

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={deviceInfo.isMobile ? 0.8 : 1}
    />
  )
}

// Loading Component
const ModelLoader: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-white mb-2">Loading 3D Model...</p>
    <Progress value={progress} className="w-48" />
    <p className="text-sm text-slate-400 mt-2">{Math.round(progress)}%</p>
  </div>
)

// Main Integrated 3D Optimizer Component
export const Integrated3DOptimizer: React.FC<{
  models: ModelData[]
  className?: string
}> = ({ models, className }) => {
  const [selectedModel, setSelectedModel] = useState<ModelData>(models[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [settings, setSettings] = useState<OptimizationSettings>({
    autoOptimize: true,
    targetFPS: 60,
    qualityLevel: 'auto',
    enableLOD: true,
    enableCulling: true,
    textureCompression: true,
    shadowQuality: 'medium',
    antiAliasing: true,
    deviceOptimization: true
  })

  const deviceInfo = useDeviceDetection()
  const metrics = usePerformanceMonitor()
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })

  // Auto-optimize based on performance
  useEffect(() => {
    if (!settings.autoOptimize) return

    if (metrics.fps < settings.targetFPS - 10) {
      setSettings(prev => ({
        ...prev,
        qualityLevel: prev.qualityLevel === 'high' ? 'medium' : 
                     prev.qualityLevel === 'medium' ? 'low' : 'low',
        shadowQuality: prev.shadowQuality === 'high' ? 'medium' : 
                      prev.shadowQuality === 'medium' ? 'low' : 'off',
        antiAliasing: false
      }))
    } else if (metrics.fps > settings.targetFPS + 10) {
      setSettings(prev => ({
        ...prev,
        qualityLevel: prev.qualityLevel === 'low' ? 'medium' : 
                     prev.qualityLevel === 'medium' ? 'high' : 'high',
        shadowQuality: prev.shadowQuality === 'off' ? 'low' : 
                      prev.shadowQuality === 'low' ? 'medium' : 'high',
        antiAliasing: true
      }))
    }
  }, [metrics.fps, settings.targetFPS, settings.autoOptimize])

  // Simulate loading progress
  useEffect(() => {
    if (!isVisible) return
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoaded(true)
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isVisible])

  const getPerformanceStatus = () => {
    if (metrics.fps >= 50) return { status: 'excellent', color: 'text-green-400', icon: CheckCircle }
    if (metrics.fps >= 30) return { status: 'good', color: 'text-yellow-400', icon: Info }
    return { status: 'poor', color: 'text-red-400', icon: AlertTriangle }
  }

  const performanceStatus = getPerformanceStatus()

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                Integrated 3D Optimizer
              </CardTitle>
              <CardDescription>
                Advanced 3D model optimization with real-time performance monitoring
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={metrics.fps >= 50 ? 'default' : metrics.fps >= 30 ? 'secondary' : 'destructive'}>
                {metrics.fps} FPS
              </Badge>
              <Badge variant="outline" className="text-slate-300">
                {deviceInfo.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="viewer" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="viewer">3D Viewer</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
            </TabsList>
            
            <TabsContent value="viewer" className="space-y-4">
              {/* 3D Viewer */}
              <div className="relative h-96 bg-slate-800 rounded-lg overflow-hidden">
                {isVisible && (
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    gl={{ 
                      antialias: settings.antiAliasing,
                      alpha: true,
                      powerPreference: deviceInfo.isMobile ? 'low-power' : 'high-performance'
                    }}
                  >
                    <Suspense fallback={<ModelLoader progress={loadingProgress} />}>
                      {isLoaded && (
                        <>
                          <OptimizedModel 
                            modelData={selectedModel}
                            settings={settings}
                            deviceInfo={deviceInfo}
                            onLoad={() => setIsLoaded(true)}
                          />
                          <Environment preset="sunset" />
                          {settings.shadowQuality !== 'off' && (
                            <ContactShadows 
                              position={[0, -1, 0]} 
                              opacity={0.4} 
                              scale={10} 
                              blur={2} 
                            />
                          )}
                          <OrbitControls 
                            enablePan={!deviceInfo.isMobile}
                            enableZoom={true}
                            enableRotate={true}
                            autoRotate={isPlaying}
                            autoRotateSpeed={2}
                          />
                          <Stats />
                        </>
                      )}
                    </Suspense>
                  </Canvas>
                )}
                
                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setIsLoaded(false)
                      setLoadingProgress(0)
                      setTimeout(() => setIsLoaded(true), 1000)
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Performance Indicator */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <performanceStatus.icon className={`w-4 h-4 ${performanceStatus.color}`} />
                      <span className="text-white">{metrics.fps} FPS</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Model Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-slate-400">Triangles</div>
                  <div className="text-lg font-semibold text-white">
                    {selectedModel.triangles.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-slate-400">Textures</div>
                  <div className="text-lg font-semibold text-white">
                    {selectedModel.textures}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-slate-400">File Size</div>
                  <div className="text-lg font-semibold text-white">
                    {(selectedModel.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-sm text-slate-400">Quality</div>
                  <div className="text-lg font-semibold text-white capitalize">
                    {selectedModel.quality}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-400">FPS</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{metrics.fps}</div>
                    <Progress value={(metrics.fps / 60) * 100} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-slate-400">CPU</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{metrics.cpuUsage.toFixed(1)}%</div>
                    <Progress value={metrics.cpuUsage} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-slate-400">Memory</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{metrics.memoryUsage.toFixed(0)} MB</div>
                    <Progress value={(metrics.memoryUsage / 512) * 100} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-slate-400">Network</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{metrics.networkLatency.toFixed(0)} ms</div>
                    <Progress value={(100 - metrics.networkLatency) / 100 * 100} className="mt-2" />
                  </CardContent>
                </Card>
                
                {deviceInfo.isMobile && (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Battery className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-slate-400">Battery</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{deviceInfo.batteryLevel}%</div>
                      <Progress value={deviceInfo.batteryLevel} className="mt-2" />
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Performance Recommendations */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Performance Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.fps < 30 && (
                      <div className="flex items-start gap-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="text-red-400 font-medium">Low FPS Detected</div>
                          <div className="text-sm text-slate-300">Consider reducing quality settings or enabling auto-optimization</div>
                        </div>
                      </div>
                    )}
                    
                    {deviceInfo.isMobile && (
                      <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <Smartphone className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <div className="text-blue-400 font-medium">Mobile Device Detected</div>
                          <div className="text-sm text-slate-300">Mobile optimizations are automatically applied</div>
                        </div>
                      </div>
                    )}
                    
                    {metrics.memoryUsage > 256 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                        <Info className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <div className="text-yellow-400 font-medium">High Memory Usage</div>
                          <div className="text-sm text-slate-300">Consider enabling texture compression or reducing model complexity</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              {/* Optimization Settings */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Optimization Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-optimize" className="text-slate-300">Auto Optimization</Label>
                    <Switch
                      id="auto-optimize"
                      checked={settings.autoOptimize}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoOptimize: checked }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Target FPS: {settings.targetFPS}</Label>
                    <Slider
                      value={[settings.targetFPS]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, targetFPS: value }))}
                      max={120}
                      min={15}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-slate-300">Quality Level</Label>
                    <Select
                      value={settings.qualityLevel}
                      onValueChange={(value: any) => setSettings(prev => ({ ...prev, qualityLevel: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-lod" className="text-slate-300">Level of Detail (LOD)</Label>
                    <Switch
                      id="enable-lod"
                      checked={settings.enableLOD}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableLOD: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="texture-compression" className="text-slate-300">Texture Compression</Label>
                    <Switch
                      id="texture-compression"
                      checked={settings.textureCompression}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, textureCompression: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anti-aliasing" className="text-slate-300">Anti-aliasing</Label>
                    <Switch
                      id="anti-aliasing"
                      checked={settings.antiAliasing}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, antiAliasing: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Device Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Device Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-400">Device Type</div>
                      <div className="text-white capitalize flex items-center gap-2">
                        {deviceInfo.type === 'mobile' && <Smartphone className="w-4 h-4" />}
                        {deviceInfo.type === 'tablet' && <Tablet className="w-4 h-4" />}
                        {deviceInfo.type === 'desktop' && <Monitor className="w-4 h-4" />}
                        {deviceInfo.type}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Screen Size</div>
                      <div className="text-white">
                        {deviceInfo.screenSize.width} × {deviceInfo.screenSize.height}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Pixel Ratio</div>
                      <div className="text-white">{deviceInfo.pixelRatio}x</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Connection</div>
                      <div className="text-white capitalize">{deviceInfo.connectionType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="models" className="space-y-4">
              {/* Model Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model) => (
                  <Card 
                    key={model.id} 
                    className={`cursor-pointer transition-all ${
                      selectedModel.id === model.id 
                        ? 'bg-blue-900/50 border-blue-500' 
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                    onClick={() => setSelectedModel(model)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-slate-700 rounded-lg mb-3 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-white font-medium mb-1">{model.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">{model.category}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{(model.size / 1024 / 1024).toFixed(1)} MB</span>
                        <span className="capitalize">{model.quality}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Model Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Model
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Optimized
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Integrated3DOptimizer