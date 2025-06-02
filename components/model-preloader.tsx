'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Download, 
  Upload,
  Play, 
  Pause, 
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  Trash2,
  Plus,
  Settings,
  Zap,
  HardDrive,
  Wifi,
  WifiOff,
  Eye,
  EyeOff
} from 'lucide-react'
import { OptimizedModelLoader, ModelCacheManager, preloadModels } from '@/lib/model-utils'

interface PreloadItem {
  id: string
  url: string
  name: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'loading' | 'loaded' | 'failed' | 'cached'
  progress: number
  size?: number
  loadTime?: number
  error?: string
  retryCount: number
  lastAttempt?: number
}

interface PreloadSettings {
  maxConcurrent: number
  retryAttempts: number
  retryDelay: number
  enableCache: boolean
  enableCompression: boolean
  networkAware: boolean
  preloadOnIdle: boolean
  priorityThreshold: number
}

interface ModelPreloaderProps {
  initialUrls?: string[]
  onPreloadComplete?: (results: PreloadItem[]) => void
  onProgress?: (progress: number) => void
  className?: string
}

const defaultSettings: PreloadSettings = {
  maxConcurrent: 3,
  retryAttempts: 3,
  retryDelay: 1000,
  enableCache: true,
  enableCompression: true,
  networkAware: true,
  preloadOnIdle: true,
  priorityThreshold: 5
}

export function ModelPreloader({ 
  initialUrls = [],
  onPreloadComplete,
  onProgress,
  className = '' 
}: ModelPreloaderProps) {
  const [items, setItems] = useState<PreloadItem[]>([])
  const [settings, setSettings] = useState<PreloadSettings>(defaultSettings)
  const [isPreloading, setIsPreloading] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online')
  const [cacheStats, setCacheStats] = useState({ size: 0, count: 0, hitRate: 0 })
  const [newUrl, setNewUrl] = useState('')
  const [newName, setNewName] = useState('')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const cacheManagerRef = useRef<ModelCacheManager>(new ModelCacheManager())
  const loaderRef = useRef<OptimizedModelLoader>(new OptimizedModelLoader())
  
  // Initialize with initial URLs
  useEffect(() => {
    if (initialUrls.length > 0) {
      const initialItems: PreloadItem[] = initialUrls.map((url, index) => ({
        id: `initial-${index}`,
        url,
        name: url.split('/').pop() || `Model ${index + 1}`,
        priority: 'medium',
        status: 'pending',
        progress: 0,
        retryCount: 0
      }))
      setItems(initialItems)
    }
  }, [initialUrls])
  
  // Monitor network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setNetworkStatus('offline')
        return
      }
      
      // Simple network speed detection
      const connection = (navigator as any).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setNetworkStatus('slow')
        } else {
          setNetworkStatus('online')
        }
      } else {
        setNetworkStatus('online')
      }
    }
    
    updateNetworkStatus()
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])
  
  // Update cache stats
  useEffect(() => {
    const updateCacheStats = () => {
      const stats = cacheManagerRef.current.getCacheStats()
      setCacheStats(stats)
    }
    
    updateCacheStats()
    const interval = setInterval(updateCacheStats, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Calculate overall progress
  useEffect(() => {
    if (items.length === 0) {
      setOverallProgress(0)
      return
    }
    
    const totalProgress = items.reduce((sum, item) => sum + item.progress, 0)
    const progress = totalProgress / items.length
    setOverallProgress(progress)
    
    if (onProgress) {
      onProgress(progress)
    }
  }, [items, onProgress])
  
  const addItem = () => {
    if (!newUrl.trim()) return
    
    const item: PreloadItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: newUrl.trim(),
      name: newName.trim() || newUrl.split('/').pop() || 'Unnamed Model',
      priority: newPriority,
      status: 'pending',
      progress: 0,
      retryCount: 0
    }
    
    setItems(prev => [...prev, item])
    setNewUrl('')
    setNewName('')
  }
  
  const removeItem = (id: string) => {
    if (isPreloading) return
    setItems(prev => prev.filter(item => item.id !== id))
  }
  
  const clearAllItems = () => {
    if (isPreloading) return
    setItems([])
  }
  
  const updateItemStatus = (id: string, updates: Partial<PreloadItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }
  
  const preloadItem = async (item: PreloadItem): Promise<void> => {
    const startTime = Date.now()
    
    try {
      updateItemStatus(item.id, { 
        status: 'loading', 
        progress: 0,
        lastAttempt: startTime
      })
      
      // Check cache first
      if (settings.enableCache && cacheManagerRef.current.has(item.url)) {
        updateItemStatus(item.id, { 
          status: 'cached', 
          progress: 100,
          loadTime: Date.now() - startTime
        })
        return
      }
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        updateItemStatus(item.id, { 
          progress: Math.min(90, item.progress + Math.random() * 20)
        })
      }, 200)
      
      // Load the model
      const model = await loaderRef.current.load(item.url, {
        enableCompression: settings.enableCompression,
        enableLOD: true,
        textureQuality: 'medium'
      })
      
      clearInterval(progressInterval)
      
      // Cache the model if enabled
      if (settings.enableCache) {
        cacheManagerRef.current.set(item.url, model, {
          priority: item.priority,
          size: item.size || 0
        })
      }
      
      const loadTime = Date.now() - startTime
      updateItemStatus(item.id, { 
        status: 'loaded', 
        progress: 100,
        loadTime,
        size: item.size || 0
      })
      
    } catch (error) {
      updateItemStatus(item.id, { 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount: item.retryCount + 1
      })
    }
  }
  
  const shouldRetry = (item: PreloadItem): boolean => {
    return item.retryCount < settings.retryAttempts && 
           item.status === 'failed' &&
           (!item.lastAttempt || Date.now() - item.lastAttempt > settings.retryDelay)
  }
  
  const startPreloading = async () => {
    if (items.length === 0) return
    
    // Check network conditions
    if (settings.networkAware && networkStatus === 'offline') {
      alert('Cannot preload models while offline')
      return
    }
    
    if (settings.networkAware && networkStatus === 'slow') {
      const proceed = confirm('Network connection is slow. Continue preloading?')
      if (!proceed) return
    }
    
    setIsPreloading(true)
    abortControllerRef.current = new AbortController()
    
    // Sort items by priority
    const sortedItems = [...items].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    
    // Process items with concurrency limit
    const processQueue = async () => {
      const activePromises: Promise<void>[] = []
      let index = 0
      
      while (index < sortedItems.length || activePromises.length > 0) {
        // Start new items up to concurrency limit
        while (activePromises.length < settings.maxConcurrent && index < sortedItems.length) {
          const item = sortedItems[index]
          
          if (item.status === 'pending' || shouldRetry(item)) {
            const promise = preloadItem(item).finally(() => {
              const promiseIndex = activePromises.indexOf(promise)
              if (promiseIndex > -1) {
                activePromises.splice(promiseIndex, 1)
              }
            })
            
            activePromises.push(promise)
          }
          
          index++
        }
        
        // Wait for at least one promise to complete
        if (activePromises.length > 0) {
          await Promise.race(activePromises)
        }
        
        // Check if aborted
        if (abortControllerRef.current?.signal.aborted) {
          break
        }
      }
    }
    
    try {
      await processQueue()
      
      const results = items.filter(item => item.status === 'loaded' || item.status === 'cached')
      if (onPreloadComplete) {
        onPreloadComplete(results)
      }
      
    } catch (error) {
      console.error('Preloading error:', error)
    } finally {
      setIsPreloading(false)
      abortControllerRef.current = null
    }
  }
  
  const stopPreloading = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }
  
  const retryFailed = () => {
    setItems(prev => prev.map(item => 
      item.status === 'failed' ? { ...item, status: 'pending', error: undefined } : item
    ))
  }
  
  const clearCache = () => {
    cacheManagerRef.current.clear()
    setCacheStats({ size: 0, count: 0, hitRate: 0 })
  }
  
  const getStatusIcon = (status: PreloadItem['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      case 'loading': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'loaded': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cached': return <HardDrive className="w-4 h-4 text-purple-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
    }
  }
  
  const getStatusColor = (status: PreloadItem['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'loading': return 'bg-blue-100 text-blue-800'
      case 'loaded': return 'bg-green-100 text-green-800'
      case 'cached': return 'bg-purple-100 text-purple-800'
      case 'failed': return 'bg-red-100 text-red-800'
    }
  }
  
  const getPriorityColor = (priority: PreloadItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
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
  
  const getNetworkIcon = () => {
    switch (networkStatus) {
      case 'online': return <Wifi className="w-4 h-4 text-green-500" />
      case 'slow': return <Wifi className="w-4 h-4 text-yellow-500" />
      case 'offline': return <WifiOff className="w-4 h-4 text-red-500" />
    }
  }
  
  const completedCount = items.filter(item => item.status === 'loaded' || item.status === 'cached').length
  const failedCount = items.filter(item => item.status === 'failed').length
  const loadingCount = items.filter(item => item.status === 'loading').length
  
  return (
    <div className={`w-full max-w-6xl space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Model Preloader
              </CardTitle>
              <CardDescription>
                Preload 3D models for better performance
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getNetworkIcon()}
                <span className="text-sm capitalize">{networkStatus}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryFailed}
                  disabled={isPreloading || failedCount === 0}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Failed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCache}
                  disabled={cacheStats.count === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          {isPreloading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedCount}/{items.length} completed
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preload Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Concurrent: {settings.maxConcurrent}</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings.maxConcurrent}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, maxConcurrent: parseInt(e.target.value) }))
                  }
                  disabled={isPreloading}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Retry Attempts: {settings.retryAttempts}</Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={settings.retryAttempts}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) }))
                  }
                  disabled={isPreloading}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable Cache</Label>
                <Switch
                  checked={settings.enableCache}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, enableCache: checked }))
                  }
                  disabled={isPreloading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable Compression</Label>
                <Switch
                  checked={settings.enableCompression}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, enableCompression: checked }))
                  }
                  disabled={isPreloading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Network Aware</Label>
                <Switch
                  checked={settings.networkAware}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, networkAware: checked }))
                  }
                  disabled={isPreloading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Preload on Idle</Label>
                <Switch
                  checked={settings.preloadOnIdle}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, preloadOnIdle: checked }))
                  }
                  disabled={isPreloading}
                />
              </div>
            </div>
            
            {/* Cache Stats */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Cache Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Models Cached:</span>
                  <span>{cacheStats.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Size:</span>
                  <span>{formatFileSize(cacheStats.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hit Rate:</span>
                  <span>{(cacheStats.hitRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preload Queue ({items.length})
              </CardTitle>
              <div className="flex gap-2">
                {!isPreloading ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllItems}
                      disabled={items.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    <Button
                      onClick={startPreloading}
                      disabled={items.length === 0 || networkStatus === 'offline'}
                      className="bg-[#39e079] hover:bg-[#51946b] text-[#0e1a13]"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Preloading
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopPreloading}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
            
            {/* Status Summary */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Loading: {loadingCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Completed: {completedCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Failed: {failedCount}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="queue" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="add">Add Models</TabsTrigger>
              </TabsList>
              
              <TabsContent value="queue" className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No models in preload queue</p>
                    <p className="text-sm">Add model URLs to start preloading</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 border rounded-lg space-y-3 ${
                            item.status === 'loading' ? 'border-blue-300 bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(item.status)}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{item.url}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                              {!isPreloading && item.status !== 'loading' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {item.status === 'loading' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Progress</span>
                                <span className="text-sm">{Math.round(item.progress)}%</span>
                              </div>
                              <Progress value={item.progress} className="h-2" />
                            </div>
                          )}
                          
                          {item.status === 'failed' && item.error && (
                            <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-red-700">{item.error}</p>
                                {item.retryCount > 0 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Retry attempts: {item.retryCount}/{settings.retryAttempts}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {(item.status === 'loaded' || item.status === 'cached') && (
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {item.loadTime && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(item.loadTime)}
                                </span>
                              )}
                              {item.size && (
                                <span className="flex items-center gap-1">
                                  <HardDrive className="w-3 h-3" />
                                  {formatFileSize(item.size)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              
              <TabsContent value="add" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Model URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/model.glb"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      disabled={isPreloading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name (optional)</Label>
                    <Input
                      id="name"
                      placeholder="My Model"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      disabled={isPreloading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="flex gap-1">
                      {(['high', 'medium', 'low'] as const).map((priority) => (
                        <Button
                          key={priority}
                          variant={newPriority === priority ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewPriority(priority)}
                          disabled={isPreloading}
                          className="flex-1"
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={addItem}
                    disabled={!newUrl.trim() || isPreloading}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Queue
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ModelPreloader