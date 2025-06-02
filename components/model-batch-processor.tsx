'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Upload, 
  Download, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  FileText,
  Archive,
  Zap,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react'
import { OptimizedModelLoader, calculateModelComplexity } from '@/lib/model-utils'
import * as THREE from 'three'

interface ProcessingJob {
  id: string
  name: string
  file: File
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  startTime?: number
  endTime?: number
  error?: string
  originalStats?: ModelStats
  optimizedStats?: ModelStats
  outputUrl?: string
  settings: ProcessingSettings
}

interface ModelStats {
  triangles: number
  vertices: number
  materials: number
  textures: number
  fileSize: number
  complexity: 'low' | 'medium' | 'high'
}

interface ProcessingSettings {
  enableCompression: boolean
  compressionLevel: number
  enableLOD: boolean
  lodLevels: number
  textureQuality: 'low' | 'medium' | 'high'
  geometryOptimization: boolean
  removeUnusedMaterials: boolean
  mergeGeometries: boolean
  outputFormat: 'glb' | 'gltf'
}

interface ModelBatchProcessorProps {
  onProcessingComplete?: (jobs: ProcessingJob[]) => void
  className?: string
}

const defaultSettings: ProcessingSettings = {
  enableCompression: true,
  compressionLevel: 7,
  enableLOD: true,
  lodLevels: 3,
  textureQuality: 'medium',
  geometryOptimization: true,
  removeUnusedMaterials: true,
  mergeGeometries: false,
  outputFormat: 'glb'
}

export function ModelBatchProcessor({ 
  onProcessingComplete,
  className = '' 
}: ModelBatchProcessorProps) {
  const [jobs, setJobs] = useState<ProcessingJob[]>([])
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [processingLog, setProcessingLog] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setProcessingLog(prev => [...prev, `[${timestamp}] ${message}`])
  }, [])
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.glb') || 
      file.name.toLowerCase().endsWith('.gltf')
    )
    
    if (validFiles.length !== files.length) {
      addLog(`Warning: ${files.length - validFiles.length} files were skipped (only .glb and .gltf files are supported)`)
    }
    
    const newJobs: ProcessingJob[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      file,
      status: 'pending',
      progress: 0,
      settings: { ...settings }
    }))
    
    setJobs(prev => [...prev, ...newJobs])
    addLog(`Added ${newJobs.length} files to processing queue`)
  }
  
  const removeJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id))
    addLog(`Removed job from queue`)
  }
  
  const clearAllJobs = () => {
    if (isProcessing) {
      addLog('Cannot clear jobs while processing')
      return
    }
    setJobs([])
    setProcessingLog([])
    addLog('Cleared all jobs')
  }
  
  const analyzeModel = async (file: File): Promise<ModelStats> => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader()
      const url = URL.createObjectURL(file)
      
      loader.load(
        url,
        (gltf) => {
          const stats = calculateModelComplexity(gltf.scene)
          URL.revokeObjectURL(url)
          resolve({
            ...stats,
            fileSize: file.size
          })
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(url)
          reject(error)
        }
      )
    })
  }
  
  const processModel = async (job: ProcessingJob): Promise<ProcessingJob> => {
    const updatedJob = { ...job }
    
    try {
      updatedJob.status = 'processing'
      updatedJob.startTime = Date.now()
      updatedJob.progress = 10
      
      addLog(`Starting processing: ${job.name}`)
      
      // Analyze original model
      addLog(`Analyzing original model: ${job.name}`)
      updatedJob.originalStats = await analyzeModel(job.file)
      updatedJob.progress = 30
      
      // Simulate processing steps
      const steps = [
        'Loading model...',
        'Optimizing geometry...',
        'Compressing textures...',
        'Generating LOD levels...',
        'Applying compression...',
        'Finalizing output...'
      ]
      
      for (let i = 0; i < steps.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Processing aborted')
        }
        
        addLog(`${job.name}: ${steps[i]}`)
        updatedJob.progress = 30 + (i + 1) * 10
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
      }
      
      // Simulate optimized stats (would be real optimization results)
      const reductionFactor = job.settings.enableCompression ? 0.6 : 0.8
      updatedJob.optimizedStats = {
        triangles: Math.round(updatedJob.originalStats.triangles * reductionFactor),
        vertices: Math.round(updatedJob.originalStats.vertices * reductionFactor),
        materials: updatedJob.originalStats.materials,
        textures: updatedJob.originalStats.textures,
        fileSize: Math.round(updatedJob.originalStats.fileSize * reductionFactor),
        complexity: updatedJob.originalStats.complexity
      }
      
      // Create output URL (in real implementation, this would be the processed file)
      updatedJob.outputUrl = URL.createObjectURL(job.file)
      
      updatedJob.status = 'completed'
      updatedJob.progress = 100
      updatedJob.endTime = Date.now()
      
      const processingTime = (updatedJob.endTime - updatedJob.startTime) / 1000
      addLog(`Completed processing: ${job.name} (${processingTime.toFixed(1)}s)`)
      
    } catch (error) {
      updatedJob.status = 'failed'
      updatedJob.error = error instanceof Error ? error.message : 'Unknown error'
      updatedJob.endTime = Date.now()
      addLog(`Failed processing: ${job.name} - ${updatedJob.error}`)
    }
    
    return updatedJob
  }
  
  const startProcessing = async () => {
    if (jobs.length === 0) {
      addLog('No jobs to process')
      return
    }
    
    setIsProcessing(true)
    setCurrentJobIndex(0)
    setOverallProgress(0)
    abortControllerRef.current = new AbortController()
    
    addLog(`Starting batch processing of ${jobs.length} models`)
    
    try {
      for (let i = 0; i < jobs.length; i++) {
        if (abortControllerRef.current.signal.aborted) {
          addLog('Processing aborted by user')
          break
        }
        
        setCurrentJobIndex(i)
        const processedJob = await processModel(jobs[i])
        
        setJobs(prev => prev.map(job => 
          job.id === processedJob.id ? processedJob : job
        ))
        
        setOverallProgress(((i + 1) / jobs.length) * 100)
      }
      
      const completedJobs = jobs.filter(job => job.status === 'completed')
      const failedJobs = jobs.filter(job => job.status === 'failed')
      
      addLog(`Batch processing completed: ${completedJobs.length} successful, ${failedJobs.length} failed`)
      
      if (onProcessingComplete) {
        onProcessingComplete(jobs)
      }
      
    } catch (error) {
      addLog(`Batch processing error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
      abortControllerRef.current = null
    }
  }
  
  const stopProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      addLog('Stopping processing...')
    }
  }
  
  const downloadResults = () => {
    const completedJobs = jobs.filter(job => job.status === 'completed')
    if (completedJobs.length === 0) {
      addLog('No completed jobs to download')
      return
    }
    
    // Create a summary report
    const report = {
      timestamp: new Date().toISOString(),
      settings,
      summary: {
        totalJobs: jobs.length,
        completed: completedJobs.length,
        failed: jobs.filter(job => job.status === 'failed').length
      },
      results: completedJobs.map(job => ({
        name: job.name,
        processingTime: job.endTime && job.startTime ? 
          (job.endTime - job.startTime) / 1000 : 0,
        originalStats: job.originalStats,
        optimizedStats: job.optimizedStats,
        reduction: job.originalStats && job.optimizedStats ? {
          triangles: ((job.originalStats.triangles - job.optimizedStats.triangles) / job.originalStats.triangles * 100).toFixed(1) + '%',
          fileSize: ((job.originalStats.fileSize - job.optimizedStats.fileSize) / job.originalStats.fileSize * 100).toFixed(1) + '%'
        } : null
      }))
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `batch-processing-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    addLog('Downloaded processing report')
  }
  
  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
    }
  }
  
  const getStatusColor = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
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
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
  }
  
  return (
    <div className={`w-full max-w-6xl space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Model Batch Processor
              </CardTitle>
              <CardDescription>
                Process multiple 3D models with optimization settings
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Files
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResults}
                disabled={jobs.filter(job => job.status === 'completed').length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".glb,.gltf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Processing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">DRACO Compression</Label>
                <Switch
                  checked={settings.enableCompression}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, enableCompression: checked }))
                  }
                  disabled={isProcessing}
                />
              </div>
              
              {settings.enableCompression && (
                <div className="space-y-2">
                  <Label className="text-sm">Compression Level: {settings.compressionLevel}</Label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.compressionLevel}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, compressionLevel: parseInt(e.target.value) }))
                    }
                    disabled={isProcessing}
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generate LOD</Label>
                <Switch
                  checked={settings.enableLOD}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, enableLOD: checked }))
                  }
                  disabled={isProcessing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Geometry Optimization</Label>
                <Switch
                  checked={settings.geometryOptimization}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, geometryOptimization: checked }))
                  }
                  disabled={isProcessing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Remove Unused Materials</Label>
                <Switch
                  checked={settings.removeUnusedMaterials}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, removeUnusedMaterials: checked }))
                  }
                  disabled={isProcessing}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Texture Quality</Label>
                <div className="flex gap-1">
                  {['low', 'medium', 'high'].map((quality) => (
                    <Button
                      key={quality}
                      variant={settings.textureQuality === quality ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => 
                        setSettings(prev => ({ ...prev, textureQuality: quality as any }))
                      }
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Output Format</Label>
                <div className="flex gap-1">
                  {['glb', 'gltf'].map((format) => (
                    <Button
                      key={format}
                      variant={settings.outputFormat === format ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => 
                        setSettings(prev => ({ ...prev, outputFormat: format as any }))
                      }
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Jobs and Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Processing Queue ({jobs.length})
              </CardTitle>
              <div className="flex gap-2">
                {!isProcessing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllJobs}
                      disabled={jobs.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    <Button
                      onClick={startProcessing}
                      disabled={jobs.length === 0}
                      className="bg-[#39e079] hover:bg-[#51946b] text-[#0e1a13]"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Processing
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={stopProcessing}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(overallProgress)}% ({currentJobIndex + 1}/{jobs.length})
                  </span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="queue" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="queue" className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No files in queue</p>
                    <p className="text-sm">Upload .glb or .gltf files to start</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {jobs.map((job, index) => (
                        <div
                          key={job.id}
                          className={`p-4 border rounded-lg space-y-3 ${
                            isProcessing && index === currentJobIndex ? 'border-blue-300 bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(job.status)}
                              <div>
                                <p className="font-medium">{job.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(job.file.size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                              {!isProcessing && job.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeJob(job.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {job.status === 'processing' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Progress</span>
                                <span className="text-sm">{job.progress}%</span>
                              </div>
                              <Progress value={job.progress} className="h-2" />
                            </div>
                          )}
                          
                          {job.status === 'failed' && job.error && (
                            <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                              <p className="text-sm text-red-700">{job.error}</p>
                            </div>
                          )}
                          
                          {job.status === 'completed' && job.originalStats && job.optimizedStats && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium mb-1">Original</p>
                                <p>Triangles: {job.originalStats.triangles.toLocaleString()}</p>
                                <p>Size: {formatFileSize(job.originalStats.fileSize)}</p>
                              </div>
                              <div>
                                <p className="font-medium mb-1">Optimized</p>
                                <p>Triangles: {job.optimizedStats.triangles.toLocaleString()}</p>
                                <p>Size: {formatFileSize(job.optimizedStats.fileSize)}</p>
                              </div>
                            </div>
                          )}
                          
                          {job.startTime && job.endTime && (
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDuration(job.endTime - job.startTime)}
                              </span>
                              {job.outputUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const a = document.createElement('a')
                                    a.href = job.outputUrl!
                                    a.download = job.name.replace(/\.[^/.]+$/, '_optimized.glb')
                                    a.click()
                                  }}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              
              <TabsContent value="logs">
                <ScrollArea className="h-96">
                  <div className="space-y-1">
                    {processingLog.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No logs yet
                      </p>
                    ) : (
                      processingLog.map((log, index) => (
                        <p key={index} className="text-xs font-mono text-muted-foreground">
                          {log}
                        </p>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ModelBatchProcessor