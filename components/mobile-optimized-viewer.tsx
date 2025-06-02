'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Battery, 
  Wifi, 
  Settings, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause
} from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface MobileOptimizedViewerProps {
  modelUrl: string
  modelName: string
  className?: string
  autoDetectDevice?: boolean
  forceMobileMode?: boolean
  onPerformanceChange?: (metrics: PerformanceMetrics) => void
}

interface PerformanceMetrics {
  fps: number
  batteryLevel?: number
  connectionType: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  renderQuality: 'low' | 'medium' | 'high'
  memoryUsage: number
}

interface DeviceCapabilities {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasTouch: boolean
  screenSize: { width: number; height: number }
  pixelRatio: number
  maxTextureSize: number
  webGLVersion: number
  batteryAPI: boolean
  connectionAPI: boolean
}

// Device detection hook
function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    screenSize: { width: 1920, height: 1080 },
    pixelRatio: 1,
    maxTextureSize: 4096,
    webGLVersion: 2,
    batteryAPI: false,
    connectionAPI: false
  })
  
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Screen size detection
      const screenSize = {
        width: window.screen.width,
        height: window.screen.height
      }
      
      // WebGL capabilities
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      const maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048
      const webGLVersion = gl instanceof WebGL2RenderingContext ? 2 : 1
      
      // API availability
      const batteryAPI = 'getBattery' in navigator
      const connectionAPI = 'connection' in navigator
      
      setCapabilities({
        isMobile: isMobile && !isTablet,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        hasTouch,
        screenSize,
        pixelRatio: window.devicePixelRatio || 1,
        maxTextureSize,
        webGLVersion,
        batteryAPI,
        connectionAPI
      })
    }
    
    detectDevice()
    window.addEventListener('resize', detectDevice)
    
    return () => window.removeEventListener('resize', detectDevice)
  }, [])
  
  return capabilities
}

// Battery and connection monitoring
function useDeviceMetrics() {
  const [metrics, setMetrics] = useState({
    batteryLevel: 1,
    isCharging: true,
    connectionType: 'unknown',
    effectiveType: '4g'
  })
  
  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery()
          setMetrics(prev => ({
            ...prev,
            batteryLevel: battery.level,
            isCharging: battery.charging
          }))
          
          const updateBatteryInfo = () => {
            setMetrics(prev => ({
              ...prev,
              batteryLevel: battery.level,
              isCharging: battery.charging
            }))
          }
          
          battery.addEventListener('levelchange', updateBatteryInfo)
          battery.addEventListener('chargingchange', updateBatteryInfo)
          
          return () => {
            battery.removeEventListener('levelchange', updateBatteryInfo)
            battery.removeEventListener('chargingchange', updateBatteryInfo)
          }
        } catch (error) {
          console.warn('Battery API not available')
        }
      }
    }
    
    const updateConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setMetrics(prev => ({
          ...prev,
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || '4g'
        }))
        
        const handleConnectionChange = () => {
          setMetrics(prev => ({
            ...prev,
            connectionType: connection.type || 'unknown',
            effectiveType: connection.effectiveType || '4g'
          }))
        }
        
        connection.addEventListener('change', handleConnectionChange)
        
        return () => {
          connection.removeEventListener('change', handleConnectionChange)
        }
      }
    }
    
    updateBattery()
    const cleanupConnection = updateConnection()
    
    return cleanupConnection
  }, [])
  
  return metrics
}

// Adaptive quality component
function AdaptiveQualityController({ 
  capabilities, 
  metrics, 
  onQualityChange 
}: { 
  capabilities: DeviceCapabilities
  metrics: any
  onQualityChange: (quality: 'low' | 'medium' | 'high') => void 
}) {
  const [manualMode, setManualMode] = useState(false)
  const [manualQuality, setManualQuality] = useState<'low' | 'medium' | 'high'>('medium')
  
  // Auto-detect optimal quality
  const autoQuality = useMemo(() => {
    let score = 0
    
    // Device type scoring
    if (capabilities.isDesktop) score += 3
    else if (capabilities.isTablet) score += 2
    else if (capabilities.isMobile) score += 1
    
    // Screen size scoring
    if (capabilities.screenSize.width >= 1920) score += 2
    else if (capabilities.screenSize.width >= 1280) score += 1
    
    // WebGL capabilities
    if (capabilities.webGLVersion >= 2) score += 1
    if (capabilities.maxTextureSize >= 4096) score += 1
    
    // Battery level (if available)
    if (metrics.batteryLevel < 0.2 && !metrics.isCharging) score -= 2
    else if (metrics.batteryLevel < 0.5 && !metrics.isCharging) score -= 1
    
    // Connection quality
    if (metrics.effectiveType === '4g' || metrics.effectiveType === '5g') score += 1
    else if (metrics.effectiveType === '3g') score -= 1
    else if (metrics.effectiveType === '2g') score -= 2
    
    // Determine quality based on score
    if (score >= 6) return 'high'
    else if (score >= 3) return 'medium'
    else return 'low'
  }, [capabilities, metrics])
  
  useEffect(() => {
    if (!manualMode) {
      onQualityChange(autoQuality)
    } else {
      onQualityChange(manualQuality)
    }
  }, [autoQuality, manualMode, manualQuality, onQualityChange])
  
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Quality Settings</h3>
        <Badge variant={autoQuality === 'high' ? 'default' : autoQuality === 'medium' ? 'secondary' : 'destructive'}>
          {manualMode ? manualQuality.toUpperCase() : `AUTO (${autoQuality.toUpperCase()})`}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Manual Control</label>
          <Switch 
            checked={manualMode} 
            onCheckedChange={setManualMode}
          />
        </div>
        
        {manualMode && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Quality Level</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <Button
                  key={quality}
                  variant={manualQuality === quality ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setManualQuality(quality)}
                  className="flex-1"
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Device info */}
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            {capabilities.isMobile && <Smartphone className="w-3 h-3" />}
            {capabilities.isTablet && <Tablet className="w-3 h-3" />}
            {capabilities.isDesktop && <Monitor className="w-3 h-3" />}
            <span>{capabilities.screenSize.width}×{capabilities.screenSize.height}</span>
          </div>
          
          {metrics.batteryLevel < 1 && (
            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3" />
              <span>{Math.round(metrics.batteryLevel * 100)}%</span>
              {metrics.isCharging && <span className="text-green-600">Charging</span>}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            <span>{metrics.effectiveType?.toUpperCase() || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Mobile-optimized model component
function MobileOptimizedModel({ 
  url, 
  quality, 
  autoRotate,
  capabilities 
}: { 
  url: string
  quality: 'low' | 'medium' | 'high'
  autoRotate: boolean
  capabilities: DeviceCapabilities
}) {
  const group = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(url, true)
  
  // Mobile-specific optimizations
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child as THREE.Mesh
          
          // Aggressive optimization for mobile
          if (capabilities.isMobile) {
            mesh.frustumCulled = true
            mesh.castShadow = quality === 'high'
            mesh.receiveShadow = quality === 'high'
            
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              const material = mesh.material
              
              // Reduce material complexity on mobile
              if (quality === 'low') {
                material.envMapIntensity = 0.2
                material.roughness = Math.max(material.roughness, 0.7)
                material.metalness = Math.min(material.metalness, 0.3)
                
                // Disable expensive features
                if (material.normalMap) {
                  material.normalScale.setScalar(0.5)
                }
              }
              
              // Optimize textures for mobile
              if (material.map) {
                material.map.minFilter = THREE.LinearFilter
                material.map.magFilter = THREE.LinearFilter
                material.map.generateMipmaps = false
                
                // Reduce texture size on low-end devices
                if (capabilities.maxTextureSize < 2048 || quality === 'low') {
                  material.map.repeat.setScalar(0.5)
                }
              }
            }
          }
        }
      })
    }
  }, [scene, quality, capabilities])
  
  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

// Main mobile-optimized viewer
export function MobileOptimizedViewer({
  modelUrl,
  modelName,
  className = '',
  autoDetectDevice = true,
  forceMobileMode = false,
  onPerformanceChange
}: MobileOptimizedViewerProps) {
  const capabilities = useDeviceCapabilities()
  const metrics = useDeviceMetrics()
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [autoRotate, setAutoRotate] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Determine if we should use mobile optimizations
  const isMobileMode = forceMobileMode || (autoDetectDevice && (capabilities.isMobile || capabilities.isTablet))
  
  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (onPerformanceChange) {
        const performanceMetrics: PerformanceMetrics = {
          fps: 60, // Would be calculated from actual frame rate
          batteryLevel: metrics.batteryLevel,
          connectionType: metrics.effectiveType,
          deviceType: capabilities.isMobile ? 'mobile' : capabilities.isTablet ? 'tablet' : 'desktop',
          renderQuality: quality,
          memoryUsage: 0 // Would be calculated from actual memory usage
        }
        onPerformanceChange(performanceMetrics)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [metrics, capabilities, quality, onPerformanceChange])
  
  // Touch gesture handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture detected
      e.preventDefault()
    }
  }, [])
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])
  
  return (
    <div className={`relative ${className}`}>
      {/* Mobile controls overlay */}
      {isMobileMode && (
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="bg-black/70 text-white hover:bg-black/80"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="bg-black/70 text-white hover:bg-black/80"
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-black/70 text-white hover:bg-black/80"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
      
      {/* Quality controls panel */}
      {showControls && (
        <div className="absolute top-16 left-4 right-4 z-10">
          <AdaptiveQualityController
            capabilities={capabilities}
            metrics={metrics}
            onQualityChange={setQuality}
          />
        </div>
      )}
      
      {/* 3D Viewer */}
      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden"
        onTouchStart={handleTouchStart}
      >
        <Canvas
          camera={{ 
            position: [0, 0, 5], 
            fov: isMobileMode ? 60 : 50 // Wider FOV for mobile
          }}
          gl={{ 
            antialias: quality !== 'low' && !isMobileMode,
            alpha: true,
            powerPreference: isMobileMode ? 'default' : 'high-performance',
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false // Better for mobile performance
          }}
          onCreated={({ gl }) => {
            // Mobile-optimized renderer settings
            if (isMobileMode) {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
              gl.shadowMap.enabled = quality === 'high'
              gl.shadowMap.type = THREE.BasicShadowMap
            } else {
              gl.setPixelRatio(window.devicePixelRatio)
              gl.shadowMap.enabled = quality !== 'low'
              gl.shadowMap.type = quality === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap
            }
            
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.0
          }}
        >
          <React.Suspense fallback={<Html center><div>Loading...</div></Html>}>
            <MobileOptimizedModel 
              url={modelUrl}
              quality={quality}
              autoRotate={autoRotate}
              capabilities={capabilities}
            />
            
            <OrbitControls 
              enablePan={!isMobileMode} // Disable pan on mobile to avoid conflicts
              enableZoom={true}
              enableRotate={true}
              dampingFactor={isMobileMode ? 0.1 : 0.05} // More responsive on mobile
              enableDamping={true}
              maxPolarAngle={Math.PI}
              minDistance={isMobileMode ? 2 : 1}
              maxDistance={isMobileMode ? 15 : 20}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
              }}
            />
            
            <Environment preset={isMobileMode ? "sunset" : "studio"} />
            
            {/* Simplified lighting for mobile */}
            <ambientLight intensity={isMobileMode ? 0.6 : 0.4} />
            {!isMobileMode && (
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={0.8}
                castShadow={quality !== 'low'}
                shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
                shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
              />
            )}
          </React.Suspense>
        </Canvas>
      </div>
      
      {/* Device info badge */}
      <div className="absolute bottom-4 left-4">
        <Badge variant="secondary" className="bg-black/70 text-white">
          {capabilities.isMobile && <Smartphone className="w-3 h-3 mr-1" />}
          {capabilities.isTablet && <Tablet className="w-3 h-3 mr-1" />}
          {capabilities.isDesktop && <Monitor className="w-3 h-3 mr-1" />}
          {quality.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}

export default MobileOptimizedViewer