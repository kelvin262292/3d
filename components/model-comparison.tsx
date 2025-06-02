'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  X, 
  Eye, 
  EyeOff,
  BarChart3, 
  Layers, 
  Clock, 
  HardDrive,
  Zap,
  Download,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { calculateModelComplexity } from '@/lib/model-utils'
import * as THREE from 'three'

interface ModelData {
  id: string
  name: string
  url: string
  visible: boolean
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
  color?: string
  opacity?: number
  stats?: {
    triangles: number
    vertices: number
    materials: number
    textures: number
    fileSize: number
    loadTime: number
    complexity: 'low' | 'medium' | 'high'
  }
}

interface ModelComparisonProps {
  initialModels?: ModelData[]
  maxModels?: number
  className?: string
}

const defaultModels: ModelData[] = [
  {
    id: '1',
    name: 'Modern Villa',
    url: '/models/modern-villa.glb',
    visible: true,
    position: [-2, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    color: '#ffffff'
  },
  {
    id: '2',
    name: 'Classic House',
    url: '/models/classic-house.glb',
    visible: true,
    position: [2, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    color: '#ffffff'
  }
]

function ModelMesh({ model, onStatsUpdate }: { 
  model: ModelData
  onStatsUpdate: (id: string, stats: any) => void 
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!model.url) return
    
    const loader = new THREE.GLTFLoader()
    const startTime = performance.now()
    
    loader.load(
      model.url,
      (gltf) => {
        const loadTime = performance.now() - startTime
        const scene = gltf.scene
        
        // Calculate model statistics
        const stats = calculateModelComplexity(scene)
        
        // Estimate file size (approximation)
        const fileSize = JSON.stringify(gltf).length
        
        onStatsUpdate(model.id, {
          ...stats,
          fileSize,
          loadTime: Math.round(loadTime)
        })
        
        if (meshRef.current) {
          meshRef.current.clear()
          meshRef.current.add(scene)
          
          // Apply transformations
          meshRef.current.position.set(...model.position)
          meshRef.current.scale.set(...model.scale)
          meshRef.current.rotation.set(...model.rotation)
          
          // Apply color and opacity if specified
          if (model.color || model.opacity !== undefined) {
            scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                if (model.color) {
                  child.material = child.material.clone()
                  child.material.color = new THREE.Color(model.color)
                }
                if (model.opacity !== undefined) {
                  child.material.transparent = true
                  child.material.opacity = model.opacity
                }
              }
            })
          }
        }
        
        setIsLoaded(true)
        setError(null)
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error)
        setError('Failed to load model')
        setIsLoaded(false)
      }
    )
  }, [model.url, model.position, model.scale, model.rotation, model.color, model.opacity])
  
  if (!model.visible) return null
  
  return (
    <group ref={meshRef}>
      {error && (
        <mesh position={model.position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" wireframe />
        </mesh>
      )}
    </group>
  )
}

export function ModelComparison({ 
  initialModels = defaultModels,
  maxModels = 4,
  className = '' 
}: ModelComparisonProps) {
  const [models, setModels] = useState<ModelData[]>(initialModels)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [newModelUrl, setNewModelUrl] = useState('')
  const [newModelName, setNewModelName] = useState('')
  const [isAddingModel, setIsAddingModel] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const addModel = () => {
    if (!newModelUrl || !newModelName || models.length >= maxModels) return
    
    const newModel: ModelData = {
      id: Date.now().toString(),
      name: newModelName,
      url: newModelUrl,
      visible: true,
      position: [models.length * 2 - 2, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: '#ffffff'
    }
    
    setModels([...models, newModel])
    setNewModelUrl('')
    setNewModelName('')
    setIsAddingModel(false)
  }
  
  const removeModel = (id: string) => {
    setModels(models.filter(model => model.id !== id))
    if (selectedModel === id) {
      setSelectedModel(null)
    }
  }
  
  const toggleModelVisibility = (id: string) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, visible: !model.visible } : model
    ))
  }
  
  const updateModelProperty = (id: string, property: keyof ModelData, value: any) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, [property]: value } : model
    ))
  }
  
  const updateModelStats = (id: string, stats: any) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, stats } : model
    ))
  }
  
  const exportComparison = () => {
    const comparisonData = {
      models: models.map(model => ({
        name: model.name,
        url: model.url,
        stats: model.stats
      })),
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `model-comparison-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const copyModelData = (model: ModelData) => {
    const data = {
      name: model.name,
      url: model.url,
      stats: model.stats
    }
    
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopiedId(model.id)
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Model Comparison
              </CardTitle>
              <CardDescription>
                Compare multiple 3D models side by side
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportComparison}
                disabled={models.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingModel(true)}
                disabled={models.length >= maxModels}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Model
              </Button>
            </div>
          </div>
          
          {/* Add Model Form */}
          {isAddingModel && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model-name">Model Name</Label>
                  <Input
                    id="model-name"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="Enter model name"
                  />
                </div>
                <div>
                  <Label htmlFor="model-url">Model URL</Label>
                  <Input
                    id="model-url"
                    value={newModelUrl}
                    onChange={(e) => setNewModelUrl(e.target.value)}
                    placeholder="Enter model URL (.glb, .gltf)"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={addModel}
                  disabled={!newModelName || !newModelUrl}
                  className="bg-[#39e079] hover:bg-[#51946b] text-[#0e1a13]"
                >
                  Add Model
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingModel(false)
                    setNewModelName('')
                    setNewModelUrl('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>
      
      {/* 3D Viewer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            3D Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-50 rounded-lg overflow-hidden">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 5, 10]} />
              <OrbitControls enablePan enableZoom enableRotate />
              <Environment preset="studio" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              
              {models.map((model) => (
                <ModelMesh
                  key={model.id}
                  model={model}
                  onStatsUpdate={updateModelStats}
                />
              ))}
            </Canvas>
          </div>
          
          {/* Model Controls */}
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium">Model Controls</Label>
            <div className="flex flex-wrap gap-2">
              {models.map((model) => (
                <div key={model.id} className="flex items-center gap-2">
                  <Button
                    variant={model.visible ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleModelVisibility(model.id)}
                    className={model.visible ? "bg-[#39e079] hover:bg-[#51946b] text-[#0e1a13]" : ""}
                  >
                    {model.visible ? (
                      <Eye className="w-4 h-4 mr-2" />
                    ) : (
                      <EyeOff className="w-4 h-4 mr-2" />
                    )}
                    {model.name}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeModel(model.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Comparison Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No models to compare</p>
              <p className="text-sm">Add models to start comparing</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Property</th>
                    {models.map((model) => (
                      <th key={model.id} className="text-left p-3 font-medium">
                        <div className="flex items-center gap-2">
                          {model.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyModelData(model)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedId === model.id ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Status</td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        <Badge variant={model.visible ? "default" : "secondary"}>
                          {model.visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Triangles
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        {model.stats ? (
                          <span className="font-mono">
                            {model.stats.triangles.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Vertices
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        {model.stats ? (
                          <span className="font-mono">
                            {model.stats.vertices.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Materials
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        {model.stats ? (
                          <span className="font-mono">{model.stats.materials}</span>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      File Size
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        {model.stats ? (
                          <span className="font-mono">
                            {formatFileSize(model.stats.fileSize)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Load Time
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        {model.stats ? (
                          <span className="font-mono">{model.stats.loadTime}ms</span>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="border-b">
                    <td className="p-3 font-medium flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Complexity
                    </td>
                    {models.map((model) => (
                      <td key={model.id} className="p-3">
                        {model.stats ? (
                          <Badge className={getComplexityColor(model.stats.complexity)}>
                            {model.stats.complexity.toUpperCase()}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recommendations */}
      {models.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {models.some(model => model.stats?.complexity === 'high') && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">High Complexity Models Detected</p>
                    <p className="text-xs text-yellow-700">
                      Some models have high complexity. Consider optimizing them for better performance.
                    </p>
                  </div>
                </div>
              )}
              
              {models.some(model => model.stats?.loadTime && model.stats.loadTime > 3000) && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Slow Loading Models</p>
                    <p className="text-xs text-red-700">
                      Some models take too long to load. Consider using DRACO compression or reducing file size.
                    </p>
                  </div>
                </div>
              )}
              
              {models.length > 2 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Performance Tip</p>
                    <p className="text-xs text-blue-700">
                      Comparing many models simultaneously may impact performance. Consider hiding unused models.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ModelComparison