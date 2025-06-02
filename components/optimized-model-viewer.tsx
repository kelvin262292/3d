'use client'

import React, { Suspense, useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html, useProgress, Preload } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, Maximize2, RotateCcw, ZoomIn, ZoomOut, Settings, Monitor } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface OptimizedModelViewerProps {
  modelUrl: string
  modelName: string
  autoRotate?: boolean
  enableControls?: boolean
  showStats?: boolean
  quality?: 'low' | 'medium' | 'high' | 'auto'
  className?: string
  lazy?: boolean
  preload?: boolean
  onLoadStart?: () => void
  onLoadComplete?: (stats: ModelStats) => void
  onError?: (error: Error) => void
}

interface ModelStats {
  fileSize: number
  triangles: number
  vertices: number
  materials: number
  textures: number
  loadTime: number
}

// Enhanced loading component with detailed progress
function EnhancedLoader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  const [loadingStage, setLoadingStage] = useState('Initializing...')
  
  useEffect(() => {
    if (progress < 20) setLoadingStage('Downloading model...')
    else if (progress < 50) setLoadingStage('Processing geometry...')
    else if (progress < 80) setLoadingStage('Loading textures...')
    else if (progress < 95) setLoadingStage('Optimizing...')
    else setLoadingStage('Finalizing...')
  }, [progress])
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-[#39e079]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[#39e079]">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div className="text-center max-w-xs">
          <p className="text-sm font-semibold text-[#0e1a13] mb-2">
            Loading 3D Model
          </p>
          <p className="text-xs text-[#51946b] mb-3">
            {loadingStage}
          </p>
          
          <Progress value={progress} className="w-48 h-2 mb-2" />
          
          <div className="flex justify-between text-xs text-[#51946b]">
            <span>{loaded}/{total} assets</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          {item && (
            <p className="text-xs text-[#51946b] mt-2 truncate max-w-48">
              {item.split('/').pop()}
            </p>
          )}
        </div>
      </div>
    </Html>
  )
}

// Performance monitor component
function PerformanceMonitor({ visible, onStatsUpdate }: { 
  visible: boolean
  onStatsUpdate?: (stats: any) => void 
}) {
  const { gl, scene } = useThree()
  const [stats, setStats] = useState({
    fps: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    drawCalls: 0,
    memoryUsage: 0
  })
  
  useFrame((state) => {
    if (visible) {
      const newStats = {
        fps: Math.round(1 / state.clock.getDelta()),
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        drawCalls: gl.info.render.calls,
        memoryUsage: (gl.info.memory.geometries + gl.info.memory.textures) * 0.001 // Approximate MB
      }
      setStats(newStats)
      onStatsUpdate?.(newStats)
    }
  })
  
  if (!visible) return null
  
  return (
    <Html position={[-3, 3, 0]}>
      <Card className="p-3 bg-black/90 text-white text-xs space-y-1 min-w-[140px]">
        <div className="flex items-center gap-2 mb-2">
          <Monitor className="w-3 h-3" />
          <span className="font-semibold">Performance</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={stats.fps < 30 ? 'text-red-400' : stats.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
              {stats.fps}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Triangles:</span>
            <span>{stats.triangles.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Draw Calls:</span>
            <span>{stats.drawCalls}</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span>{stats.memoryUsage.toFixed(1)}MB</span>
          </div>
          <div className="flex justify-between">
            <span>Geometries:</span>
            <span>{stats.geometries}</span>
          </div>
          <div className="flex justify-between">
            <span>Textures:</span>
            <span>{stats.textures}</span>
          </div>
        </div>
      </Card>
    </Html>
  )
}

// Optimized model component with LOD and compression
function OptimizedModel({ 
  url, 
  quality = 'auto',
  autoRotate = false,
  onLoadComplete
}: { 
  url: string
  quality: 'low' | 'medium' | 'high' | 'auto'
  autoRotate: boolean
  onLoadComplete?: (stats: ModelStats) => void
}) {
  const group = useRef<THREE.Group>(null!)
  const { gl, camera } = useThree()
  const [loadStartTime] = useState(Date.now())
  const [modelStats, setModelStats] = useState<ModelStats | null>(null)
  
  // Configure advanced loaders
  const dracoLoader = useMemo(() => {
    const loader = new DRACOLoader()
    loader.setDecoderPath('/draco/')
    loader.setDecoderConfig({ type: 'js' })
    return loader
  }, [])
  
  const ktx2Loader = useMemo(() => {
    const loader = new KTX2Loader()
    loader.setTranscoderPath('/basis/')
    loader.detectSupport(gl)
    return loader
  }, [gl])
  
  const gltfLoader = useMemo(() => {
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.setKTX2Loader(ktx2Loader)
    loader.setMeshoptDecoder(MeshoptDecoder)
    return loader
  }, [dracoLoader, ktx2Loader])
  
  // Load model with advanced optimization
  const { scene, animations } = useGLTF(url, true)
  
  // Auto-detect quality based on device capabilities
  const detectedQuality = useMemo(() => {
    if (quality !== 'auto') return quality
    
    const canvas = gl.domElement
    const context = gl.getContext()
    const maxTextureSize = gl.capabilities.maxTextureSize
    const maxVertexUniforms = gl.capabilities.maxVertexUniforms
    
    // Simple device capability detection
    if (maxTextureSize >= 4096 && maxVertexUniforms >= 1024) {
      return 'high'
    } else if (maxTextureSize >= 2048 && maxVertexUniforms >= 512) {
      return 'medium'
    } else {
      return 'low'
    }
  }, [gl, quality])
  
  // Auto rotation with performance consideration
  useFrame((state, delta) => {
    if (autoRotate && group.current) {
      // Reduce rotation speed if FPS is low
      const rotationSpeed = state.clock.getDelta() > 0.033 ? 0.3 : 0.5 // Slower if < 30 FPS
      group.current.rotation.y += delta * rotationSpeed
    }
  })
  
  // Advanced optimization based on quality and device capabilities
  useEffect(() => {
    if (scene) {
      let triangleCount = 0
      let vertexCount = 0
      let materialCount = 0
      let textureCount = 0
      
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child as THREE.Mesh
          
          // Count statistics
          if (mesh.geometry) {
            const geometry = mesh.geometry
            if (geometry.index) {
              triangleCount += geometry.index.count / 3
            } else if (geometry.attributes.position) {
              triangleCount += geometry.attributes.position.count / 3
            }
            vertexCount += geometry.attributes.position?.count || 0
          }
          
          if (mesh.material) {
            materialCount++
            
            // Apply quality-based optimizations
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              const material = mesh.material
              
              switch (detectedQuality) {
                case 'low':
                  // Aggressive optimization for low-end devices
                  if (material.map) {
                    material.map.minFilter = THREE.LinearFilter
                    material.map.magFilter = THREE.LinearFilter
                    material.map.generateMipmaps = false
                    textureCount++
                  }
                  // Disable expensive features
                  material.envMapIntensity = 0.3
                  material.roughness = Math.max(material.roughness, 0.5)
                  break
                  
                case 'medium':
                  // Balanced optimization
                  if (material.map) {
                    material.map.minFilter = THREE.LinearMipmapLinearFilter
                    material.map.magFilter = THREE.LinearFilter
                    textureCount++
                  }
                  material.envMapIntensity = 0.7
                  break
                  
                case 'high':
                  // High quality settings
                  if (material.map) {
                    material.map.minFilter = THREE.LinearMipmapLinearFilter
                    material.map.magFilter = THREE.LinearFilter
                    material.map.generateMipmaps = true
                    material.map.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 4)
                    textureCount++
                  }
                  material.envMapIntensity = 1.0
                  break
              }
            }
          }
          
          // Performance optimizations
          mesh.frustumCulled = true
          mesh.castShadow = detectedQuality !== 'low'
          mesh.receiveShadow = detectedQuality !== 'low'
          
          // LOD optimization for distant objects
          mesh.onBeforeRender = (renderer, scene, camera) => {
            const distance = camera.position.distanceTo(mesh.position)
            if (distance > 50 && detectedQuality === 'low') {
              mesh.visible = false
            } else {
              mesh.visible = true
            }
          }
        }
      })
      
      // Calculate and report statistics
      const stats: ModelStats = {
        fileSize: 0, // Would need to be passed from loader
        triangles: triangleCount,
        vertices: vertexCount,
        materials: materialCount,
        textures: textureCount,
        loadTime: Date.now() - loadStartTime
      }
      
      setModelStats(stats)
      onLoadComplete?.(stats)
    }
  }, [scene, detectedQuality, gl, loadStartTime, onLoadComplete])
  
  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

// Main optimized model viewer component
export function OptimizedModelViewer({
  modelUrl,
  modelName,
  autoRotate = false,
  enableControls = true,
  showStats = false,
  quality = 'auto',
  className = '',
  lazy = true,
  preload = false,
  onLoadStart,
  onLoadComplete,
  onError
}: OptimizedModelViewerProps) {
  const [isVisible, setIsVisible] = useState(!lazy)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [performanceStats, setPerformanceStats] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Intersection observer for lazy loading
  const { isIntersecting } = useIntersectionObserver({
    elementRef: containerRef,
    threshold: 0.1,
    rootMargin: '50px'
  })
  
  useEffect(() => {
    if (lazy && isIntersecting) {
      setIsVisible(true)
    }
  }, [lazy, isIntersecting])
  
  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
    onLoadStart?.()
  }, [onLoadStart])
  
  const handleLoadComplete = useCallback((stats: ModelStats) => {
    setIsLoading(false)
    onLoadComplete?.(stats)
  }, [onLoadComplete])
  
  const handleError = useCallback((error: Error) => {
    setError(error)
    setIsLoading(false)
    onError?.(error)
  }, [onError])
  
  const resetError = useCallback(() => {
    setError(null)
    setIsVisible(true)
  }, [])
  
  if (error) {
    return (
      <div className={`relative w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load 3D model</h3>
          <p className="text-sm text-red-600 mb-4">
            {error.message || 'An error occurred while loading the model'}
          </p>
          <Button onClick={resetError} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div ref={containerRef} className={`relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {!isVisible ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-lg mb-4 mx-auto flex items-center justify-center">
              <Settings className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-sm text-gray-600">3D Model will load when visible</p>
          </div>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: quality !== 'low',
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.2
            gl.shadowMap.enabled = quality !== 'low'
            gl.shadowMap.type = quality === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap
          }}
        >
          <Suspense fallback={<EnhancedLoader />}>
            <OptimizedModel 
              url={modelUrl}
              quality={quality}
              autoRotate={autoRotate}
              onLoadComplete={handleLoadComplete}
            />
            
            {enableControls && (
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                dampingFactor={0.05}
                enableDamping={true}
                maxPolarAngle={Math.PI}
                minDistance={1}
                maxDistance={20}
              />
            )}
            
            <Environment preset="studio" />
            
            {/* Optimized lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={0.8}
              castShadow={quality !== 'low'}
              shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
              shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
            />
            
            <PerformanceMonitor 
              visible={showStats} 
              onStatsUpdate={setPerformanceStats}
            />
            
            {preload && <Preload all />}
          </Suspense>
        </Canvas>
      )}
      
      {/* Quality indicator */}
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-black/70 text-white">
          {quality === 'auto' ? 'Auto' : quality.toUpperCase()}
        </Badge>
      </div>
      
      {/* Performance indicator */}
      {performanceStats && (
        <div className="absolute bottom-4 right-4">
          <Badge 
            variant={performanceStats.fps < 30 ? 'destructive' : performanceStats.fps < 50 ? 'default' : 'secondary'}
            className="bg-black/70 text-white"
          >
            {performanceStats.fps} FPS
          </Badge>
        </div>
      )}
    </div>
  )
}

export default OptimizedModelViewer