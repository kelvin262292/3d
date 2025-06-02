'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html, useProgress } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Loader2, 
  Maximize2, 
  RotateCcw, 
  Settings, 
  Download,
  Share2,
  Eye,
  Zap,
  BarChart3
} from 'lucide-react'
import { ModelViewer3D } from './model-viewer-3d'
import { useModelOptimization } from '@/hooks/use-model-optimization'
import { calculateModelComplexity, performanceMonitor } from '@/lib/model-utils'
import * as THREE from 'three'

interface ProductModel3DProps {
  product: {
    id: string
    name: string
    modelUrl?: string
    images: string[]
    category: string
  }
  className?: string
}

// Model loading component with progress
function ModelLoader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-[#39e079]/20 border-t-[#39e079] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#39e079]" />
          </div>
        </div>
        
        <div className="text-center max-w-sm">
          <h3 className="text-lg font-semibold text-[#0e1a13] mb-2">
            Loading 3D Model
          </h3>
          
          <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#39e079] to-[#51946b] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="space-y-1 text-sm">
            <p className="font-medium text-[#0e1a13]">
              {Math.round(progress)}% Complete
            </p>
            <p className="text-[#51946b]">
              {loaded} of {total} assets loaded
            </p>
            {item && (
              <p className="text-xs text-[#51946b] truncate">
                Loading: {item.split('/').pop()}
              </p>
            )}
          </div>
          
          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium mb-1">Loading Issues:</p>
              {errors.map((error, index) => (
                <p key={index} className="text-xs text-red-500">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </Html>
  )
}

// Model statistics component
function ModelStats({ 
  scene, 
  visible 
}: { 
  scene: THREE.Group | null
  visible: boolean 
}) {
  const [stats, setStats] = useState<any>(null)
  const [performance, setPerformance] = useState<any>(null)
  
  useEffect(() => {
    if (scene && visible) {
      const complexity = calculateModelComplexity(scene)
      setStats(complexity)
      
      const perfMetrics = performanceMonitor.getMetrics()
      setPerformance(perfMetrics)
    }
  }, [scene, visible])
  
  if (!visible || !stats) return null
  
  return (
    <Card className="absolute top-4 left-4 p-4 bg-black/80 text-white text-sm space-y-3 min-w-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4" />
        <span className="font-semibold">Model Statistics</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Triangles:</span>
          <span className="font-mono">{stats.triangles.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Vertices:</span>
          <span className="font-mono">{stats.vertices.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Materials:</span>
          <span className="font-mono">{stats.materials}</span>
        </div>
        <div className="flex justify-between">
          <span>Textures:</span>
          <span className="font-mono">{stats.textures}</span>
        </div>
        <div className="flex justify-between">
          <span>Complexity:</span>
          <Badge 
            variant={stats.complexity === 'high' ? 'destructive' : 
                    stats.complexity === 'medium' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {stats.complexity.toUpperCase()}
          </Badge>
        </div>
      </div>
      
      {performance && (
        <>
          <hr className="border-white/20" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Load Time:</span>
              <span className="font-mono">{Math.round(performance.averageLoadTime)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Usage:</span>
              <span className="font-mono">{Math.round(performance.cacheStats.utilization)}%</span>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

// Fallback component when no 3D model is available
function ImageFallback({ images, productName }: { images: string[], productName: string }) {
  const [currentImage, setCurrentImage] = useState(0)
  
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      {/* Main image */}
      <div className="relative w-full h-full">
        <img
          src={images[currentImage] || '/placeholder-product.jpg'}
          alt={productName}
          className="w-full h-full object-cover"
        />
        
        {/* No 3D model indicator */}
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            <Eye className="w-3 h-3 mr-1" />
            2D View
          </Badge>
        </div>
        
        {/* Image navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImage 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ProductModel3D({ product, className = '' }: ProductModel3DProps) {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [showStats, setShowStats] = useState(false)
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const [autoRotate, setAutoRotate] = useState(true)
  
  // Check if 3D model is available
  const has3DModel = Boolean(product.modelUrl)
  
  // Use optimization hook if 3D model is available
  const {
    optimizedModel,
    isLoading,
    error,
    progress,
    reoptimize
  } = useModelOptimization(
    product.modelUrl || '',
    {
      enableLOD: true,
      compressionLevel: quality,
      enableFrustumCulling: true,
      textureResolution: quality
    }
  )
  
  // Auto-switch to 2D if no 3D model
  useEffect(() => {
    if (!has3DModel) {
      setViewMode('2d')
    }
  }, [has3DModel])
  
  const handleDownload = () => {
    if (product.modelUrl) {
      const link = document.createElement('a')
      link.href = product.modelUrl
      link.download = `${product.name.replace(/\s+/g, '_')}_3D_Model`
      link.click()
    }
  }
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - 3D Model`,
          text: `Check out this 3D model of ${product.name}`,
          url: window.location.href
        })
      } catch (err) {
        // Sharing failed, fallback to clipboard
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }
  
  return (
    <div className={`relative bg-white rounded-lg overflow-hidden border ${className}`}>
      {/* Header Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {/* View Mode Toggle */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as '3d' | '2d')}>
          <TabsList className="bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="3d" disabled={!has3DModel}>
              3D
            </TabsTrigger>
            <TabsTrigger value="2d">
              2D
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* 3D Controls */}
        {viewMode === '3d' && has3DModel && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuality(
                quality === 'low' ? 'medium' : 
                quality === 'medium' ? 'high' : 'low'
              )}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Badge variant="outline" className="text-xs">
                {quality.toUpperCase()}
              </Badge>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
            </Button>
          </>
        )}
        
        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        {has3DModel && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Model Name Badge */}
      <div className="absolute bottom-4 left-4 z-20">
        <Badge className="bg-white/90 backdrop-blur-sm text-[#0e1a13] border">
          {product.name}
        </Badge>
      </div>
      
      {/* Content */}
      <div className="relative w-full h-[500px]">
        {viewMode === '3d' && has3DModel ? (
          <>
            {/* 3D Model Viewer */}
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              shadows
              gl={{ 
                antialias: quality !== 'low',
                alpha: true,
                powerPreference: 'high-performance'
              }}
            >
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1}
                castShadow
                shadow-mapSize-width={quality === 'high' ? 2048 : 1024}
                shadow-mapSize-height={quality === 'high' ? 2048 : 1024}
              />
              
              {/* Environment */}
              <Environment preset="studio" />
              
              {/* Model */}
              <Suspense fallback={<ModelLoader />}>
                {optimizedModel && (
                  <primitive 
                    object={optimizedModel.scene} 
                    scale={1}
                    position={[0, 0, 0]}
                  />
                )}
              </Suspense>
              
              {/* Controls */}
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
                maxPolarAngle={Math.PI / 1.5}
                minDistance={2}
                maxDistance={10}
              />
            </Canvas>
            
            {/* Model Statistics */}
            <ModelStats 
              scene={optimizedModel?.scene || null}
              visible={showStats}
            />
            
            {/* Loading/Error States */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#39e079] mx-auto mb-4" />
                  <p className="text-sm font-medium text-[#0e1a13]">
                    Optimizing 3D Model...
                  </p>
                  <p className="text-xs text-[#51946b] mt-1">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="text-center p-6">
                  <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Failed to load 3D model
                  </h3>
                  <p className="text-sm text-red-600 mb-4">
                    {error.message}
                  </p>
                  <Button 
                    onClick={reoptimize}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* 2D Image Fallback */
          <ImageFallback 
            images={product.images} 
            productName={product.name}
          />
        )}
      </div>
      
      {/* No 3D Model Available Message */}
      {!has3DModel && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <Card className="p-4 bg-white/90 backdrop-blur-sm">
            <Eye className="w-8 h-8 text-[#51946b] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#0e1a13] mb-1">
              3D Model Not Available
            </p>
            <p className="text-xs text-[#51946b]">
              Viewing product images instead
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ProductModel3D