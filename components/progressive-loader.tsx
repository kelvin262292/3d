'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html, useProgress, Bounds } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Pause, 
  Play,
  SkipForward,
  Wifi,
  WifiOff,
  Zap,
  Clock
} from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface ProgressiveLoaderProps {
  modelUrl: string
  modelName: string
  className?: string
  enableLazyLoading?: boolean
  chunkSize?: number
  priority?: 'low' | 'medium' | 'high'
  onLoadComplete?: () => void
  onLoadError?: (error: Error) => void
  onProgressUpdate?: (progress: LoadingProgress) => void
}

interface LoadingProgress {
  stage: 'idle' | 'downloading' | 'parsing' | 'optimizing' | 'rendering' | 'complete' | 'error'
  percentage: number
  bytesLoaded: number
  bytesTotal: number
  timeElapsed: number
  estimatedTimeRemaining: number
  currentChunk: number
  totalChunks: number
  connectionSpeed: number
}

interface ModelChunk {
  id: string
  url: string
  size: number
  priority: number
  loaded: boolean
  data?: ArrayBuffer
  error?: Error
}

// Connection speed detector
function useConnectionSpeed() {
  const [speed, setSpeed] = useState(0)
  const [type, setType] = useState('unknown')
  
  useEffect(() => {
    const detectSpeed = async () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setType(connection.effectiveType || 'unknown')
        
        // Estimate speed based on connection type
        const speedMap: Record<string, number> = {
          'slow-2g': 0.05, // 50 KB/s
          '2g': 0.25,      // 250 KB/s
          '3g': 1.5,       // 1.5 MB/s
          '4g': 10,        // 10 MB/s
          '5g': 50         // 50 MB/s
        }
        
        setSpeed(speedMap[connection.effectiveType] || 5)
        
        const handleChange = () => {
          setType(connection.effectiveType || 'unknown')
          setSpeed(speedMap[connection.effectiveType] || 5)
        }
        
        connection.addEventListener('change', handleChange)
        return () => connection.removeEventListener('change', handleChange)
      } else {
        // Fallback: measure actual download speed
        try {
          const startTime = Date.now()
          const response = await fetch('/api/speed-test', { method: 'HEAD' })
          const endTime = Date.now()
          const duration = (endTime - startTime) / 1000
          const estimatedSpeed = 1 / duration // Very rough estimate
          setSpeed(Math.min(estimatedSpeed, 10))
        } catch {
          setSpeed(5) // Default fallback
        }
      }
    }
    
    detectSpeed()
  }, [])
  
  return { speed, type }
}

// Progressive model loader hook
function useProgressiveLoader({
  modelUrl,
  chunkSize = 512 * 1024, // 512KB chunks
  priority = 'medium',
  onProgressUpdate,
  onLoadComplete,
  onLoadError
}: {
  modelUrl: string
  chunkSize?: number
  priority?: 'low' | 'medium' | 'high'
  onProgressUpdate?: (progress: LoadingProgress) => void
  onLoadComplete?: () => void
  onLoadError?: (error: Error) => void
}) {
  const [progress, setProgress] = useState<LoadingProgress>({
    stage: 'idle',
    percentage: 0,
    bytesLoaded: 0,
    bytesTotal: 0,
    timeElapsed: 0,
    estimatedTimeRemaining: 0,
    currentChunk: 0,
    totalChunks: 0,
    connectionSpeed: 0
  })
  
  const [chunks, setChunks] = useState<ModelChunk[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [modelData, setModelData] = useState<ArrayBuffer | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const startTimeRef = useRef<number>(0)
  const { speed: connectionSpeed } = useConnectionSpeed()
  
  // Initialize chunks
  const initializeChunks = useCallback(async () => {
    try {
      const response = await fetch(modelUrl, { method: 'HEAD' })
      const contentLength = parseInt(response.headers.get('content-length') || '0')
      
      if (contentLength === 0) {
        throw new Error('Unable to determine file size')
      }
      
      const totalChunks = Math.ceil(contentLength / chunkSize)
      const newChunks: ModelChunk[] = []
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize - 1, contentLength - 1)
        
        newChunks.push({
          id: `chunk-${i}`,
          url: modelUrl,
          size: end - start + 1,
          priority: i === 0 ? 10 : priority === 'high' ? 8 : priority === 'medium' ? 5 : 2,
          loaded: false
        })
      }
      
      setChunks(newChunks)
      setProgress(prev => ({
        ...prev,
        bytesTotal: contentLength,
        totalChunks,
        connectionSpeed
      }))
      
      return newChunks
    } catch (error) {
      const err = error as Error
      setProgress(prev => ({ ...prev, stage: 'error' }))
      onLoadError?.(err)
      throw err
    }
  }, [modelUrl, chunkSize, priority, connectionSpeed, onLoadError])
  
  // Load individual chunk
  const loadChunk = useCallback(async (chunk: ModelChunk, index: number): Promise<ArrayBuffer> => {
    const start = index * chunkSize
    const end = Math.min(start + chunk.size - 1, progress.bytesTotal - 1)
    
    const response = await fetch(chunk.url, {
      headers: {
        'Range': `bytes=${start}-${end}`
      },
      signal: abortControllerRef.current?.signal
    })
    
    if (!response.ok) {
      throw new Error(`Failed to load chunk ${index}: ${response.statusText}`)
    }
    
    return await response.arrayBuffer()
  }, [chunkSize, progress.bytesTotal])
  
  // Progressive loading function
  const startLoading = useCallback(async () => {
    if (isLoading || isPaused) return
    
    setIsLoading(true)
    setProgress(prev => ({ ...prev, stage: 'downloading' }))
    startTimeRef.current = Date.now()
    abortControllerRef.current = new AbortController()
    
    try {
      const initializedChunks = chunks.length > 0 ? chunks : await initializeChunks()
      const loadedChunks: ArrayBuffer[] = new Array(initializedChunks.length)
      let bytesLoaded = 0
      
      // Sort chunks by priority (highest first)
      const sortedChunks = [...initializedChunks].sort((a, b) => b.priority - a.priority)
      
      for (let i = 0; i < sortedChunks.length; i++) {
        if (isPaused || abortControllerRef.current?.signal.aborted) {
          break
        }
        
        const chunk = sortedChunks[i]
        const originalIndex = initializedChunks.findIndex(c => c.id === chunk.id)
        
        try {
          setProgress(prev => ({ ...prev, currentChunk: i + 1 }))
          
          const chunkData = await loadChunk(chunk, originalIndex)
          loadedChunks[originalIndex] = chunkData
          bytesLoaded += chunkData.byteLength
          
          // Update progress
          const timeElapsed = (Date.now() - startTimeRef.current) / 1000
          const percentage = (bytesLoaded / progress.bytesTotal) * 100
          const speed = bytesLoaded / timeElapsed / 1024 / 1024 // MB/s
          const estimatedTimeRemaining = (progress.bytesTotal - bytesLoaded) / (speed * 1024 * 1024)
          
          const newProgress: LoadingProgress = {
            ...progress,
            stage: 'downloading',
            percentage,
            bytesLoaded,
            timeElapsed,
            estimatedTimeRemaining,
            currentChunk: i + 1,
            connectionSpeed: speed
          }
          
          setProgress(newProgress)
          onProgressUpdate?.(newProgress)
          
          // Mark chunk as loaded
          setChunks(prev => prev.map(c => 
            c.id === chunk.id ? { ...c, loaded: true, data: chunkData } : c
          ))
          
          // Yield control to prevent blocking
          await new Promise(resolve => setTimeout(resolve, 0))
          
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            break
          }
          
          console.warn(`Failed to load chunk ${originalIndex}:`, error)
          // Continue with other chunks
        }
      }
      
      if (!isPaused && !abortControllerRef.current?.signal.aborted) {
        // Combine all chunks
        setProgress(prev => ({ ...prev, stage: 'parsing' }))
        
        const totalSize = loadedChunks.reduce((sum, chunk) => sum + (chunk?.byteLength || 0), 0)
        const combinedData = new Uint8Array(totalSize)
        let offset = 0
        
        for (const chunk of loadedChunks) {
          if (chunk) {
            combinedData.set(new Uint8Array(chunk), offset)
            offset += chunk.byteLength
          }
        }
        
        setModelData(combinedData.buffer)
        setProgress(prev => ({ 
          ...prev, 
          stage: 'complete', 
          percentage: 100 
        }))
        
        onLoadComplete?.()
      }
      
    } catch (error) {
      const err = error as Error
      setProgress(prev => ({ ...prev, stage: 'error' }))
      onLoadError?.(err)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isPaused, chunks, initializeChunks, loadChunk, progress, onProgressUpdate, onLoadComplete, onLoadError])
  
  const pauseLoading = useCallback(() => {
    setIsPaused(true)
    abortControllerRef.current?.abort()
  }, [])
  
  const resumeLoading = useCallback(() => {
    setIsPaused(false)
    startLoading()
  }, [startLoading])
  
  const cancelLoading = useCallback(() => {
    setIsPaused(false)
    setIsLoading(false)
    abortControllerRef.current?.abort()
    setProgress({
      stage: 'idle',
      percentage: 0,
      bytesLoaded: 0,
      bytesTotal: 0,
      timeElapsed: 0,
      estimatedTimeRemaining: 0,
      currentChunk: 0,
      totalChunks: 0,
      connectionSpeed: 0
    })
    setChunks([])
    setModelData(null)
  }, [])
  
  return {
    progress,
    chunks,
    isLoading,
    isPaused,
    modelData,
    startLoading,
    pauseLoading,
    resumeLoading,
    cancelLoading
  }
}

// Progressive loading UI component
function ProgressiveLoadingUI({ 
  progress, 
  isLoading, 
  isPaused, 
  onStart, 
  onPause, 
  onResume, 
  onCancel 
}: {
  progress: LoadingProgress
  isLoading: boolean
  isPaused: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onCancel: () => void
}) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }
  
  const getStageIcon = () => {
    switch (progress.stage) {
      case 'downloading':
        return <Download className="w-4 h-4 animate-bounce" />
      case 'parsing':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }
  
  const getStageText = () => {
    switch (progress.stage) {
      case 'downloading':
        return `Downloading chunk ${progress.currentChunk}/${progress.totalChunks}`
      case 'parsing':
        return 'Processing model data...'
      case 'optimizing':
        return 'Optimizing for display...'
      case 'rendering':
        return 'Preparing 3D scene...'
      case 'complete':
        return 'Loading complete!'
      case 'error':
        return 'Loading failed'
      default:
        return 'Ready to load'
    }
  }
  
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStageIcon()}
          <span className="font-medium">{getStageText()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {progress.connectionSpeed > 0 && (
            <Badge variant="outline" className="text-xs">
              {progress.connectionSpeed > 1 ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {progress.connectionSpeed.toFixed(1)} MB/s
            </Badge>
          )}
        </div>
      </div>
      
      {progress.stage !== 'idle' && progress.stage !== 'complete' && (
        <div className="space-y-2">
          <Progress value={progress.percentage} className="w-full" />
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>{formatBytes(progress.bytesLoaded)} / {formatBytes(progress.bytesTotal)}</span>
            <span>{progress.percentage.toFixed(1)}%</span>
          </div>
          
          {progress.estimatedTimeRemaining > 0 && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Elapsed: {formatTime(progress.timeElapsed)}</span>
              <span>Remaining: {formatTime(progress.estimatedTimeRemaining)}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        {!isLoading && progress.stage === 'idle' && (
          <Button onClick={onStart} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Start Loading
          </Button>
        )}
        
        {isLoading && !isPaused && (
          <Button onClick={onPause} variant="outline" className="flex-1">
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
        
        {isPaused && (
          <Button onClick={onResume} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
        )}
        
        {(isLoading || isPaused) && (
          <Button onClick={onCancel} variant="destructive">
            Cancel
          </Button>
        )}
      </div>
    </Card>
  )
}

// Lazy-loaded model component
function LazyModel({ modelData, modelName }: { modelData: ArrayBuffer | null, modelName: string }) {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!modelData) return
    
    const loadModel = async () => {
      try {
        const loader = new THREE.GLTFLoader()
        const dracoLoader = new THREE.DRACOLoader()
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)
        
        // Convert ArrayBuffer to Blob URL
        const blob = new Blob([modelData], { type: 'model/gltf-binary' })
        const url = URL.createObjectURL(blob)
        
        const gltf = await new Promise<any>((resolve, reject) => {
          loader.load(url, resolve, undefined, reject)
        })
        
        setModel(gltf.scene)
        URL.revokeObjectURL(url)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model')
      }
    }
    
    loadModel()
  }, [modelData])
  
  if (error) {
    return (
      <Html center>
        <div className="text-red-500 text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <div>Failed to load {modelName}</div>
          <div className="text-xs">{error}</div>
        </div>
      </Html>
    )
  }
  
  if (!model) {
    return (
      <Html center>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <div>Processing {modelName}...</div>
        </div>
      </Html>
    )
  }
  
  return <primitive object={model} />
}

// Main progressive loader component
export function ProgressiveLoader({
  modelUrl,
  modelName,
  className = '',
  enableLazyLoading = true,
  chunkSize = 512 * 1024,
  priority = 'medium',
  onLoadComplete,
  onLoadError,
  onProgressUpdate
}: ProgressiveLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 })
  
  const {
    progress,
    chunks,
    isLoading,
    isPaused,
    modelData,
    startLoading,
    pauseLoading,
    resumeLoading,
    cancelLoading
  } = useProgressiveLoader({
    modelUrl,
    chunkSize,
    priority,
    onProgressUpdate,
    onLoadComplete,
    onLoadError
  })
  
  // Auto-start loading when visible (if lazy loading is enabled)
  useEffect(() => {
    if (enableLazyLoading && isVisible && !isLoading && progress.stage === 'idle') {
      startLoading()
    }
  }, [enableLazyLoading, isVisible, isLoading, progress.stage, startLoading])
  
  return (
    <div ref={containerRef} className={`space-y-4 ${className}`}>
      {/* Loading UI */}
      <ProgressiveLoadingUI
        progress={progress}
        isLoading={isLoading}
        isPaused={isPaused}
        onStart={startLoading}
        onPause={pauseLoading}
        onResume={resumeLoading}
        onCancel={cancelLoading}
      />
      
      {/* 3D Viewer */}
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        {progress.stage === 'complete' && modelData ? (
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <React.Suspense fallback={<Html center><Loader2 className="w-8 h-8 animate-spin" /></Html>}>
              <LazyModel modelData={modelData} modelName={modelName} />
              <OrbitControls enableDamping dampingFactor={0.05} />
              <Environment preset="studio" />
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
            </React.Suspense>
          </Canvas>
        ) : (
          <div className="flex items-center justify-center h-full">
            {progress.stage === 'idle' ? (
              <div className="text-center text-gray-500">
                <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div className="text-lg font-medium">Ready to load {modelName}</div>
                <div className="text-sm">Click "Start Loading" to begin</div>
              </div>
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
        )}
      </div>
      
      {/* Chunk loading status */}
      {chunks.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-2">Loading Progress</h4>
          <div className="grid grid-cols-10 gap-1">
            {chunks.map((chunk, index) => (
              <div
                key={chunk.id}
                className={`h-2 rounded-sm ${
                  chunk.loaded 
                    ? 'bg-green-500' 
                    : progress.currentChunk > index 
                    ? 'bg-blue-500 animate-pulse' 
                    : 'bg-gray-200'
                }`}
                title={`Chunk ${index + 1}: ${chunk.loaded ? 'Loaded' : 'Pending'}`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {chunks.filter(c => c.loaded).length} / {chunks.length} chunks loaded
          </div>
        </Card>
      )}
    </div>
  )
}

export default ProgressiveLoader