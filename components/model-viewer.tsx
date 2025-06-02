'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera,
  Html,
  useProgress,
  Stats,
  Grid,
  GizmoHelper,
  GizmoViewport,
  TransformControls,
  Box,
  Sphere,
  Plane
} from '@react-three/drei'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Play, 
  Pause, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move3D,
  RotateCw,
  Sun,
  Moon,
  Grid3X3,
  Eye,
  EyeOff,
  Camera,
  Download,
  Share2,
  Settings,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Palette,
  Layers,
  Box as BoxIcon,
  Sphere as SphereIcon,
  Triangle,
  Lightbulb,
  Monitor,
  Smartphone,
  Tablet,
  Gamepad2,
  MousePointer,
  Hand,
  Crosshair,
  MoreVertical
} from 'lucide-react'
import * as THREE from 'three'
import { useModelOptimization } from '@/hooks/use-model-optimization'
import { OptimizedModelLoader, ModelPerformanceMonitor } from '@/lib/model-utils'

interface ViewerSettings {
  autoRotate: boolean
  autoRotateSpeed: number
  enableZoom: boolean
  enablePan: boolean
  enableRotate: boolean
  showGrid: boolean
  showStats: boolean
  showGizmo: boolean
  showShadows: boolean
  showWireframe: boolean
  backgroundColor: string
  environmentPreset: string
  lightIntensity: number
  shadowIntensity: number
  cameraFov: number
  cameraPosition: [number, number, number]
  controlsTarget: [number, number, number]
  animationSpeed: number
  quality: 'low' | 'medium' | 'high' | 'ultra'
  enablePostProcessing: boolean
  enableAntialiasing: boolean
  pixelRatio: number
}

interface ModelViewerProps {
  modelUrl?: string
  modelData?: any
  width?: number
  height?: number
  className?: string
  onLoad?: (model: any) => void
  onError?: (error: Error) => void
  onProgress?: (progress: number) => void
  initialSettings?: Partial<ViewerSettings>
  showControls?: boolean
  showToolbar?: boolean
  enableVR?: boolean
  enableAR?: boolean
}

const defaultSettings: ViewerSettings = {
  autoRotate: false,
  autoRotateSpeed: 1,
  enableZoom: true,
  enablePan: true,
  enableRotate: true,
  showGrid: false,
  showStats: false,
  showGizmo: false,
  showShadows: true,
  showWireframe: false,
  backgroundColor: '#f0f0f0',
  environmentPreset: 'city',
  lightIntensity: 1,
  shadowIntensity: 0.5,
  cameraFov: 45,
  cameraPosition: [5, 5, 5],
  controlsTarget: [0, 0, 0],
  animationSpeed: 1,
  quality: 'medium',
  enablePostProcessing: false,
  enableAntialiasing: true,
  pixelRatio: 1
}

const environmentPresets = [
  'apartment', 'city', 'dawn', 'forest', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse'
]

function Loader() {
  const { progress } = useProgress()
  
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div className="text-center">
          <p className="font-medium">Loading Model</p>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          <Progress value={progress} className="w-48 mt-2" />
        </div>
      </div>
    </Html>
  )
}

function Model({ 
  url, 
  data, 
  settings, 
  onLoad, 
  onError 
}: { 
  url?: string
  data?: any
  settings: ViewerSettings
  onLoad?: (model: any) => void
  onError?: (error: Error) => void
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [model, setModel] = useState<any>(null)
  const [animations, setAnimations] = useState<THREE.AnimationClip[]>([])
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null)
  const [currentAnimation, setCurrentAnimation] = useState<THREE.AnimationAction | null>(null)
  
  const { optimizeModel } = useModelOptimization()
  
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta * settings.animationSpeed)
    }
    
    if (meshRef.current && settings.autoRotate) {
      meshRef.current.rotation.y += delta * settings.autoRotateSpeed
    }
  })
  
  useEffect(() => {
    if (!url && !data) return
    
    const loader = new OptimizedModelLoader()
    
    const loadModel = async () => {
      try {
        let loadedModel
        
        if (data) {
          loadedModel = data
        } else if (url) {
          loadedModel = await loader.load(url, {
            enableCompression: settings.quality !== 'low',
            enableLOD: settings.quality === 'high' || settings.quality === 'ultra',
            textureQuality: settings.quality
          })
        }
        
        if (loadedModel) {
          // Optimize the model
          const optimizedModel = await optimizeModel(loadedModel, {
            targetTriangles: settings.quality === 'low' ? 10000 : 
                           settings.quality === 'medium' ? 50000 : 
                           settings.quality === 'high' ? 100000 : 200000,
            textureSize: settings.quality === 'low' ? 512 : 
                        settings.quality === 'medium' ? 1024 : 
                        settings.quality === 'high' ? 2048 : 4096,
            enableLOD: settings.quality !== 'low',
            enableCompression: true
          })
          
          setModel(optimizedModel)
          
          // Extract animations
          if (optimizedModel.animations && optimizedModel.animations.length > 0) {
            setAnimations(optimizedModel.animations)
            
            const animationMixer = new THREE.AnimationMixer(optimizedModel.scene)
            setMixer(animationMixer)
            
            // Play first animation by default
            const action = animationMixer.clipAction(optimizedModel.animations[0])
            action.play()
            setCurrentAnimation(action)
          }
          
          if (onLoad) {
            onLoad(optimizedModel)
          }
        }
      } catch (error) {
        console.error('Model loading error:', error)
        if (onError) {
          onError(error as Error)
        }
      }
    }
    
    loadModel()
    
    return () => {
      loader.dispose()
    }
  }, [url, data, settings.quality, optimizeModel, onLoad, onError])
  
  useEffect(() => {
    if (model && meshRef.current) {
      // Apply wireframe setting
      model.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.material.wireframe = settings.showWireframe
        }
      })
    }
  }, [model, settings.showWireframe])
  
  if (!model) return null
  
  return (
    <group ref={meshRef}>
      <primitive object={model.scene} />
    </group>
  )
}

function CameraController({ settings }: { settings: ViewerSettings }) {
  const { camera } = useThree()
  
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = settings.cameraFov
      camera.position.set(...settings.cameraPosition)
      camera.updateProjectionMatrix()
    }
  }, [camera, settings.cameraFov, settings.cameraPosition])
  
  return null
}

function SceneEnvironment({ settings }: { settings: ViewerSettings }) {
  return (
    <>
      <color attach="background" args={[settings.backgroundColor]} />
      <Environment preset={settings.environmentPreset as any} />
      
      {/* Lighting */}
      <ambientLight intensity={settings.lightIntensity * 0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={settings.lightIntensity}
        castShadow={settings.showShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Shadows */}
      {settings.showShadows && (
        <ContactShadows 
          position={[0, -1, 0]} 
          opacity={settings.shadowIntensity} 
          scale={10} 
          blur={2} 
          far={4} 
        />
      )}
      
      {/* Grid */}
      {settings.showGrid && (
        <Grid 
          position={[0, -1, 0]} 
          args={[10, 10]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#6f6f6f" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#9d4b4b" 
          fadeDistance={25} 
          fadeStrength={1} 
        />
      )}
    </>
  )
}

export function ModelViewer({
  modelUrl,
  modelData,
  width = 800,
  height = 600,
  className = '',
  onLoad,
  onError,
  onProgress,
  initialSettings = {},
  showControls = true,
  showToolbar = true,
  enableVR = false,
  enableAR = false
}: ModelViewerProps) {
  const [settings, setSettings] = useState<ViewerSettings>({
    ...defaultSettings,
    ...initialSettings
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<'perspective' | 'orthographic'>('perspective')
  const [controlMode, setControlMode] = useState<'orbit' | 'fly' | 'first-person'>('orbit')
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const performanceMonitor = useRef(new ModelPerformanceMonitor())
  
  const updateSetting = useCallback(<K extends keyof ViewerSettings>(
    key: K, 
    value: ViewerSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])
  
  const resetCamera = () => {
    updateSetting('cameraPosition', defaultSettings.cameraPosition)
    updateSetting('controlsTarget', defaultSettings.controlsTarget)
  }
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }
  
  const exportScreenshot = () => {
    // This would need to be implemented with canvas.toDataURL()
    // Export screenshot functionality would be implemented here
  }
  
  const shareModel = () => {
    if (navigator.share && modelUrl) {
      navigator.share({
        title: 'Check out this 3D model',
        url: modelUrl
      })
    }
  }
  
  const addPrimitive = (type: 'box' | 'sphere' | 'plane') => {
    // This would add a primitive to the scene
    // Add primitive functionality would be implemented here
  }
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])
  
  const canvasProps = {
    shadows: settings.showShadows,
    dpr: settings.pixelRatio,
    gl: {
      antialias: settings.enableAntialiasing,
      alpha: true,
      powerPreference: 'high-performance' as const
    },
    camera: {
      fov: settings.cameraFov,
      position: settings.cameraPosition
    }
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      style={{ width, height: isFullscreen ? '100vh' : height }}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white/90 backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetCamera}
              className="bg-white/90 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSetting('autoRotate', !settings.autoRotate)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <RotateCw className={`w-4 h-4 ${settings.autoRotate ? 'text-blue-600' : ''}`} />
            </Button>
            
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-md p-1">
              <Button
                variant={viewMode === 'perspective' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('perspective')}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'orthographic' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('orthographic')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportScreenshot}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Camera className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareModel}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-white/90 backdrop-blur-sm"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-20 w-80">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Viewer Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="display" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                  <TabsTrigger value="lighting">Light</TabsTrigger>
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                </TabsList>
                
                <TabsContent value="display" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Auto Rotate</Label>
                      <Switch
                        checked={settings.autoRotate}
                        onCheckedChange={(checked) => updateSetting('autoRotate', checked)}
                      />
                    </div>
                    
                    {settings.autoRotate && (
                      <div className="space-y-2">
                        <Label className="text-sm">Rotation Speed: {settings.autoRotateSpeed.toFixed(1)}</Label>
                        <Slider
                          value={[settings.autoRotateSpeed]}
                          onValueChange={([value]) => updateSetting('autoRotateSpeed', value)}
                          min={0.1}
                          max={5}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Grid</Label>
                      <Switch
                        checked={settings.showGrid}
                        onCheckedChange={(checked) => updateSetting('showGrid', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Shadows</Label>
                      <Switch
                        checked={settings.showShadows}
                        onCheckedChange={(checked) => updateSetting('showShadows', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Wireframe</Label>
                      <Switch
                        checked={settings.showWireframe}
                        onCheckedChange={(checked) => updateSetting('showWireframe', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Stats</Label>
                      <Switch
                        checked={settings.showStats}
                        onCheckedChange={(checked) => updateSetting('showStats', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Gizmo</Label>
                      <Switch
                        checked={settings.showGizmo}
                        onCheckedChange={(checked) => updateSetting('showGizmo', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="camera" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Field of View: {settings.cameraFov}°</Label>
                      <Slider
                        value={[settings.cameraFov]}
                        onValueChange={([value]) => updateSetting('cameraFov', value)}
                        min={10}
                        max={120}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable Zoom</Label>
                      <Switch
                        checked={settings.enableZoom}
                        onCheckedChange={(checked) => updateSetting('enableZoom', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable Pan</Label>
                      <Switch
                        checked={settings.enablePan}
                        onCheckedChange={(checked) => updateSetting('enablePan', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable Rotate</Label>
                      <Switch
                        checked={settings.enableRotate}
                        onCheckedChange={(checked) => updateSetting('enableRotate', checked)}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetCamera}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Camera
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="lighting" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Light Intensity: {settings.lightIntensity.toFixed(1)}</Label>
                      <Slider
                        value={[settings.lightIntensity]}
                        onValueChange={([value]) => updateSetting('lightIntensity', value)}
                        min={0}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Shadow Intensity: {settings.shadowIntensity.toFixed(1)}</Label>
                      <Slider
                        value={[settings.shadowIntensity]}
                        onValueChange={([value]) => updateSetting('shadowIntensity', value)}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Environment</Label>
                      <select
                        value={settings.environmentPreset}
                        onChange={(e) => updateSetting('environmentPreset', e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        {environmentPresets.map(preset => (
                          <option key={preset} value={preset}>
                            {preset.charAt(0).toUpperCase() + preset.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="quality" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Quality Preset</Label>
                      <div className="grid grid-cols-2 gap-1">
                        {(['low', 'medium', 'high', 'ultra'] as const).map(quality => (
                          <Button
                            key={quality}
                            variant={settings.quality === quality ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSetting('quality', quality)}
                            className="text-xs"
                          >
                            {quality.charAt(0).toUpperCase() + quality.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Pixel Ratio: {settings.pixelRatio.toFixed(1)}</Label>
                      <Slider
                        value={[settings.pixelRatio]}
                        onValueChange={([value]) => updateSetting('pixelRatio', value)}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Antialiasing</Label>
                      <Switch
                        checked={settings.enableAntialiasing}
                        onCheckedChange={(checked) => updateSetting('enableAntialiasing', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Post Processing</Label>
                      <Switch
                        checked={settings.enablePostProcessing}
                        onCheckedChange={(checked) => updateSetting('enablePostProcessing', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Add Primitives Panel */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPrimitive('box')}
            className="bg-white/90 backdrop-blur-sm"
            title="Add Box"
          >
            <BoxIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPrimitive('sphere')}
            className="bg-white/90 backdrop-blur-sm"
            title="Add Sphere"
          >
            <SphereIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPrimitive('plane')}
            className="bg-white/90 backdrop-blur-sm"
            title="Add Plane"
          >
            <Triangle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Canvas */}
      <Canvas {...canvasProps}>
        <Suspense fallback={<Loader />}>
          <CameraController settings={settings} />
          <SceneEnvironment settings={settings} />
          
          <Model
            url={modelUrl}
            data={modelData}
            settings={settings}
            onLoad={onLoad}
            onError={onError}
          />
          
          <OrbitControls
            enableZoom={settings.enableZoom}
            enablePan={settings.enablePan}
            enableRotate={settings.enableRotate}
            autoRotate={settings.autoRotate}
            autoRotateSpeed={settings.autoRotateSpeed}
            target={settings.controlsTarget}
          />
          
          {settings.showGizmo && (
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
            </GizmoHelper>
          )}
          
          {settings.showStats && <Stats />}
        </Suspense>
      </Canvas>
      
      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1 text-xs">
          <Badge variant="outline" className="text-xs">
            {settings.quality.toUpperCase()}
          </Badge>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">
            {Math.round(settings.cameraFov)}° FOV
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">
            {settings.pixelRatio}x DPR
          </span>
        </div>
      </div>
    </div>
  )
}

export default ModelViewer