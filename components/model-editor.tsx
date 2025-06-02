'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  TransformControls, 
  Select,
  Html,
  useProgress,
  Stats,
  Grid,
  GizmoHelper,
  GizmoViewport,
  Box,
  Sphere,
  Plane,
  Cylinder,
  Cone,
  Torus,
  Environment
} from '@react-three/drei'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Move3D,
  RotateCw,
  Scale,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Box as BoxIcon,
  Circle,
  Triangle,
  Cylinder as CylinderIcon,
  Cone as ConeIcon,
  Palette,
  Lightbulb,
  Camera,
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Settings,
  Plus,
  Minus,
  MoreVertical,
  Grid3X3,
  Crosshair,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize,
  Minimize
} from 'lucide-react'
import * as THREE from 'three'
import { useModelOptimization } from '@/hooks/use-model-optimization'
import { OptimizedModelLoader } from '@/lib/model-utils'

interface SceneObject {
  id: string
  name: string
  type: 'model' | 'primitive' | 'light' | 'camera'
  primitiveType?: 'box' | 'sphere' | 'plane' | 'cylinder' | 'cone' | 'torus'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
  locked: boolean
  material?: {
    color: string
    metalness: number
    roughness: number
    opacity: number
    wireframe: boolean
  }
  geometry?: {
    width?: number
    height?: number
    depth?: number
    radius?: number
    segments?: number
  }
  modelUrl?: string
  parentId?: string
  children: string[]
}

interface EditorSettings {
  transformMode: 'translate' | 'rotate' | 'scale'
  transformSpace: 'world' | 'local'
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  showGizmos: boolean
  showStats: boolean
  autoSave: boolean
  autoSaveInterval: number
  selectionMode: 'single' | 'multiple'
  cameraMode: 'orbit' | 'fly' | 'first-person'
  renderMode: 'solid' | 'wireframe' | 'points'
  lightingMode: 'realistic' | 'flat' | 'unlit'
}

interface ModelEditorProps {
  initialScene?: SceneObject[]
  onSceneChange?: (scene: SceneObject[]) => void
  onSave?: (scene: SceneObject[]) => void
  onLoad?: (scene: SceneObject[]) => void
  width?: number
  height?: number
  className?: string
}

const defaultSettings: EditorSettings = {
  transformMode: 'translate',
  transformSpace: 'world',
  snapToGrid: false,
  gridSize: 1,
  showGrid: true,
  showGizmos: true,
  showStats: false,
  autoSave: true,
  autoSaveInterval: 30000,
  selectionMode: 'single',
  cameraMode: 'orbit',
  renderMode: 'solid',
  lightingMode: 'realistic'
}

const defaultMaterial = {
  color: '#ffffff',
  metalness: 0,
  roughness: 0.5,
  opacity: 1,
  wireframe: false
}

function Loader() {
  const { progress } = useProgress()
  
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div className="text-center">
          <p className="font-medium">Loading Editor</p>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </div>
      </div>
    </Html>
  )
}

function SceneObjectComponent({ 
  object, 
  isSelected, 
  onSelect, 
  onTransform,
  settings 
}: { 
  object: SceneObject
  isSelected: boolean
  onSelect: (id: string) => void
  onTransform: (id: string, transform: Partial<SceneObject>) => void
  settings: EditorSettings
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [model, setModel] = useState<any>(null)
  
  useEffect(() => {
    if (object.type === 'model' && object.modelUrl) {
      const loader = new OptimizedModelLoader()
      loader.load(object.modelUrl).then(setModel).catch(console.error)
    }
  }, [object.modelUrl, object.type])
  
  const handleTransform = useCallback(() => {
    if (meshRef.current) {
      const { position, rotation, scale } = meshRef.current
      onTransform(object.id, {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z]
      })
    }
  }, [object.id, onTransform])
  
  if (!object.visible) return null
  
  const material = (
    <meshStandardMaterial
      color={object.material?.color || defaultMaterial.color}
      metalness={object.material?.metalness ?? defaultMaterial.metalness}
      roughness={object.material?.roughness ?? defaultMaterial.roughness}
      transparent={object.material?.opacity !== undefined && object.material.opacity < 1}
      opacity={object.material?.opacity ?? defaultMaterial.opacity}
      wireframe={object.material?.wireframe ?? (settings.renderMode === 'wireframe')}
    />
  )
  
  const renderPrimitive = () => {
    const geometry = object.geometry || {}
    
    switch (object.primitiveType) {
      case 'box':
        return (
          <Box
            ref={meshRef}
            args={[geometry.width || 1, geometry.height || 1, geometry.depth || 1]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Box>
        )
      case 'sphere':
        return (
          <Sphere
            ref={meshRef}
            args={[geometry.radius || 0.5, geometry.segments || 32, geometry.segments || 16]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Sphere>
        )
      case 'plane':
        return (
          <Plane
            ref={meshRef}
            args={[geometry.width || 1, geometry.height || 1]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Plane>
        )
      case 'cylinder':
        return (
          <Cylinder
            ref={meshRef}
            args={[geometry.radius || 0.5, geometry.radius || 0.5, geometry.height || 1, geometry.segments || 32]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Cylinder>
        )
      case 'cone':
        return (
          <Cone
            ref={meshRef}
            args={[geometry.radius || 0.5, geometry.height || 1, geometry.segments || 32]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Cone>
        )
      case 'torus':
        return (
          <Torus
            ref={meshRef}
            args={[geometry.radius || 0.5, (geometry.radius || 0.5) * 0.4, geometry.segments || 16, geometry.segments || 32]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Torus>
        )
      default:
        return null
    }
  }
  
  const renderModel = () => {
    if (!model) return null
    
    return (
      <primitive
        ref={meshRef}
        object={model.scene.clone()}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={() => onSelect(object.id)}
        onPointerDown={handleTransform}
      />
    )
  }
  
  return (
    <group>
      {object.type === 'primitive' && renderPrimitive()}
      {object.type === 'model' && renderModel()}
      
      {isSelected && settings.showGizmos && (
        <TransformControls
          object={meshRef.current}
          mode={settings.transformMode}
          space={settings.transformSpace}
          onObjectChange={handleTransform}
        />
      )}
    </group>
  )
}

function SceneEnvironment({ settings }: { settings: EditorSettings }) {
  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
      
      {settings.lightingMode === 'realistic' && (
        <>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        </>
      )}
      
      {settings.lightingMode === 'flat' && (
        <ambientLight intensity={1} />
      )}
      
      {settings.showGrid && (
        <Grid 
          position={[0, 0, 0]} 
          args={[20, 20]} 
          cellSize={settings.gridSize} 
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

export function ModelEditor({
  initialScene = [],
  onSceneChange,
  onSave,
  onLoad,
  width = 1200,
  height = 800,
  className = ''
}: ModelEditorProps) {
  const [scene, setScene] = useState<SceneObject[]>(initialScene)
  const [selectedObjects, setSelectedObjects] = useState<string[]>([])
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings)
  const [history, setHistory] = useState<SceneObject[][]>([initialScene])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showHierarchy, setShowHierarchy] = useState(true)
  const [showProperties, setShowProperties] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const updateSetting = useCallback(<K extends keyof EditorSettings>(
    key: K, 
    value: EditorSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])
  
  const addToHistory = useCallback((newScene: SceneObject[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newScene)
      return newHistory.slice(-50) // Keep last 50 states
    })
    setHistoryIndex(prev => Math.min(prev + 1, 49))
  }, [historyIndex])
  
  const updateScene = useCallback((newScene: SceneObject[]) => {
    setScene(newScene)
    addToHistory(newScene)
    if (onSceneChange) {
      onSceneChange(newScene)
    }
  }, [addToHistory, onSceneChange])
  
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setScene(history[newIndex])
    }
  }
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setScene(history[newIndex])
    }
  }
  
  const generateId = () => {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  const addPrimitive = (primitiveType: SceneObject['primitiveType']) => {
    const newObject: SceneObject = {
      id: generateId(),
      name: `${primitiveType?.charAt(0).toUpperCase()}${primitiveType?.slice(1)} ${scene.length + 1}`,
      type: 'primitive',
      primitiveType,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      locked: false,
      material: { ...defaultMaterial },
      geometry: {},
      children: []
    }
    
    updateScene([...scene, newObject])
    setSelectedObjects([newObject.id])
  }
  
  const addModel = (url: string) => {
    const newObject: SceneObject = {
      id: generateId(),
      name: `Model ${scene.length + 1}`,
      type: 'model',
      modelUrl: url,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      locked: false,
      children: []
    }
    
    updateScene([...scene, newObject])
    setSelectedObjects([newObject.id])
  }
  
  const deleteSelected = () => {
    if (selectedObjects.length === 0) return
    
    const newScene = scene.filter(obj => !selectedObjects.includes(obj.id))
    updateScene(newScene)
    setSelectedObjects([])
  }
  
  const duplicateSelected = () => {
    if (selectedObjects.length === 0) return
    
    const duplicates = selectedObjects.map(id => {
      const original = scene.find(obj => obj.id === id)
      if (!original) return null
      
      return {
        ...original,
        id: generateId(),
        name: `${original.name} Copy`,
        position: [original.position[0] + 1, original.position[1], original.position[2]] as [number, number, number]
      }
    }).filter(Boolean) as SceneObject[]
    
    updateScene([...scene, ...duplicates])
    setSelectedObjects(duplicates.map(obj => obj.id))
  }
  
  const selectObject = (id: string) => {
    if (settings.selectionMode === 'single') {
      setSelectedObjects([id])
    } else {
      setSelectedObjects(prev => 
        prev.includes(id) 
          ? prev.filter(objId => objId !== id)
          : [...prev, id]
      )
    }
  }
  
  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    const newScene = scene.map(obj => 
      obj.id === id ? { ...obj, ...updates } : obj
    )
    updateScene(newScene)
  }
  
  const transformObject = (id: string, transform: Partial<SceneObject>) => {
    updateObject(id, transform)
  }
  
  const saveScene = () => {
    if (onSave) {
      onSave(scene)
    } else {
      // Default save to localStorage
      localStorage.setItem('modelEditor_scene', JSON.stringify(scene))
    }
  }
  
  const loadScene = () => {
    if (onLoad) {
      // Custom load handler
      const loadedScene = [] // This would come from onLoad
      updateScene(loadedScene)
    } else {
      // Default load from localStorage
      const saved = localStorage.getItem('modelEditor_scene')
      if (saved) {
        try {
          const loadedScene = JSON.parse(saved)
          updateScene(loadedScene)
        } catch (error) {
          console.error('Failed to load scene:', error)
        }
      }
    }
  }
  
  const exportScene = () => {
    const dataStr = JSON.stringify(scene, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'scene.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
  
  const importScene = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedScene = JSON.parse(e.target?.result as string)
        updateScene(importedScene)
      } catch (error) {
        console.error('Failed to import scene:', error)
      }
    }
    reader.readAsText(file)
  }
  
  const selectedObject = selectedObjects.length === 1 
    ? scene.find(obj => obj.id === selectedObjects[0]) 
    : null
  
  // Auto-save
  useEffect(() => {
    if (!settings.autoSave) return
    
    const interval = setInterval(() => {
      saveScene()
    }, settings.autoSaveInterval)
    
    return () => clearInterval(interval)
  }, [settings.autoSave, settings.autoSaveInterval, scene])
  
  return (
    <div className={`flex h-full bg-gray-100 ${className}`} style={{ width, height }}>
      {/* Hierarchy Panel */}
      {showHierarchy && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm">Scene Hierarchy</h3>
            <div className="flex gap-1 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPrimitive('box')}
                title="Add Box"
              >
                <BoxIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPrimitive('sphere')}
                title="Add Sphere"
              >
                <Circle className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPrimitive('plane')}
                title="Add Plane"
              >
                <Triangle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {scene.map(object => (
                <div
                  key={object.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedObjects.includes(object.id) ? 'bg-blue-100 border border-blue-300' : ''
                  }`}
                  onClick={() => selectObject(object.id)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateObject(object.id, { visible: !object.visible })
                    }}
                    className="p-0 h-auto"
                  >
                    {object.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateObject(object.id, { locked: !object.locked })
                    }}
                    className="p-0 h-auto"
                  >
                    {object.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </Button>
                  
                  <span className="flex-1 text-sm truncate">{object.name}</span>
                  
                  <Badge variant="outline" className="text-xs">
                    {object.type}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        {showToolbar && (
          <div className="bg-white border-b border-gray-200 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* File Operations */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                  <Button variant="outline" size="sm" onClick={saveScene}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={loadScene}>
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportScene}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={importScene}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* History */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={undo}
                    disabled={historyIndex === 0}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={redo}
                    disabled={historyIndex === history.length - 1}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Transform Tools */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                  <Button
                    variant={settings.transformMode === 'translate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('transformMode', 'translate')}
                  >
                    <Move3D className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={settings.transformMode === 'rotate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('transformMode', 'rotate')}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={settings.transformMode === 'scale' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('transformMode', 'scale')}
                  >
                    <Scale className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Object Operations */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={duplicateSelected}
                    disabled={selectedObjects.length === 0}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={deleteSelected}
                    disabled={selectedObjects.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Options */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={settings.showGrid ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('showGrid', !settings.showGrid)}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={settings.showStats ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('showStats', !settings.showStats)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Panel Toggles */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={showHierarchy ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowHierarchy(!showHierarchy)}
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={showProperties ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowProperties(!showProperties)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Canvas */}
        <div className="flex-1 relative">
          <Canvas
            shadows
            camera={{ position: [5, 5, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={<Loader />}>
              <SceneEnvironment settings={settings} />
              
              {scene.map(object => (
                <SceneObjectComponent
                  key={object.id}
                  object={object}
                  isSelected={selectedObjects.includes(object.id)}
                  onSelect={selectObject}
                  onTransform={transformObject}
                  settings={settings}
                />
              ))}
              
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                makeDefault
              />
              
              {settings.showGizmos && (
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                  <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
                </GizmoHelper>
              )}
              
              {settings.showStats && <Stats />}
            </Suspense>
          </Canvas>
        </div>
      </div>
      
      {/* Properties Panel */}
      {showProperties && selectedObject && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-sm">Properties</h3>
            <p className="text-xs text-muted-foreground">{selectedObject.name}</p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Basic Properties */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Basic</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={selectedObject.name}
                      onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Visible</Label>
                    <Switch
                      checked={selectedObject.visible}
                      onCheckedChange={(checked) => updateObject(selectedObject.id, { visible: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Locked</Label>
                    <Switch
                      checked={selectedObject.locked}
                      onCheckedChange={(checked) => updateObject(selectedObject.id, { locked: checked })}
                    />
                  </div>
                </div>
              </div>
              
              {/* Transform */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Transform</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Position</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {selectedObject.position.map((value, index) => (
                        <Input
                          key={index}
                          type="number"
                          value={value.toFixed(2)}
                          onChange={(e) => {
                            const newPosition = [...selectedObject.position] as [number, number, number]
                            newPosition[index] = parseFloat(e.target.value) || 0
                            updateObject(selectedObject.id, { position: newPosition })
                          }}
                          className="h-8 text-xs"
                          step="0.1"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Rotation</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {selectedObject.rotation.map((value, index) => (
                        <Input
                          key={index}
                          type="number"
                          value={(value * 180 / Math.PI).toFixed(1)}
                          onChange={(e) => {
                            const newRotation = [...selectedObject.rotation] as [number, number, number]
                            newRotation[index] = (parseFloat(e.target.value) || 0) * Math.PI / 180
                            updateObject(selectedObject.id, { rotation: newRotation })
                          }}
                          className="h-8 text-xs"
                          step="1"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Scale</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {selectedObject.scale.map((value, index) => (
                        <Input
                          key={index}
                          type="number"
                          value={value.toFixed(2)}
                          onChange={(e) => {
                            const newScale = [...selectedObject.scale] as [number, number, number]
                            newScale[index] = parseFloat(e.target.value) || 0
                            updateObject(selectedObject.id, { scale: newScale })
                          }}
                          className="h-8 text-xs"
                          step="0.1"
                          min="0.01"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Material */}
              {selectedObject.material && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Material</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Color</Label>
                      <Input
                        type="color"
                        value={selectedObject.material.color}
                        onChange={(e) => updateObject(selectedObject.id, {
                          material: { ...selectedObject.material!, color: e.target.value }
                        })}
                        className="h-8"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Metalness: {selectedObject.material.metalness.toFixed(2)}</Label>
                      <Slider
                        value={[selectedObject.material.metalness]}
                        onValueChange={([value]) => updateObject(selectedObject.id, {
                          material: { ...selectedObject.material!, metalness: value }
                        })}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Roughness: {selectedObject.material.roughness.toFixed(2)}</Label>
                      <Slider
                        value={[selectedObject.material.roughness]}
                        onValueChange={([value]) => updateObject(selectedObject.id, {
                          material: { ...selectedObject.material!, roughness: value }
                        })}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Opacity: {selectedObject.material.opacity.toFixed(2)}</Label>
                      <Slider
                        value={[selectedObject.material.opacity]}
                        onValueChange={([value]) => updateObject(selectedObject.id, {
                          material: { ...selectedObject.material!, opacity: value }
                        })}
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Wireframe</Label>
                      <Switch
                        checked={selectedObject.material.wireframe}
                        onCheckedChange={(checked) => updateObject(selectedObject.id, {
                          material: { ...selectedObject.material!, wireframe: checked }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Geometry */}
              {selectedObject.geometry && selectedObject.type === 'primitive' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Geometry</h4>
                  <div className="space-y-2">
                    {selectedObject.primitiveType === 'box' && (
                      <>
                        <div>
                          <Label className="text-xs">Width</Label>
                          <Input
                            type="number"
                            value={selectedObject.geometry.width || 1}
                            onChange={(e) => updateObject(selectedObject.id, {
                              geometry: { ...selectedObject.geometry!, width: parseFloat(e.target.value) || 1 }
                            })}
                            className="h-8 text-sm"
                            step="0.1"
                            min="0.1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Height</Label>
                          <Input
                            type="number"
                            value={selectedObject.geometry.height || 1}
                            onChange={(e) => updateObject(selectedObject.id, {
                              geometry: { ...selectedObject.geometry!, height: parseFloat(e.target.value) || 1 }
                            })}
                            className="h-8 text-sm"
                            step="0.1"
                            min="0.1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Depth</Label>
                          <Input
                            type="number"
                            value={selectedObject.geometry.depth || 1}
                            onChange={(e) => updateObject(selectedObject.id, {
                              geometry: { ...selectedObject.geometry!, depth: parseFloat(e.target.value) || 1 }
                            })}
                            className="h-8 text-sm"
                            step="0.1"
                            min="0.1"
                          />
                        </div>
                      </>
                    )}
                    
                    {(selectedObject.primitiveType === 'sphere' || selectedObject.primitiveType === 'cylinder') && (
                      <>
                        <div>
                          <Label className="text-xs">Radius</Label>
                          <Input
                            type="number"
                            value={selectedObject.geometry.radius || 0.5}
                            onChange={(e) => updateObject(selectedObject.id, {
                              geometry: { ...selectedObject.geometry!, radius: parseFloat(e.target.value) || 0.5 }
                            })}
                            className="h-8 text-sm"
                            step="0.1"
                            min="0.1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Segments</Label>
                          <Input
                            type="number"
                            value={selectedObject.geometry.segments || 32}
                            onChange={(e) => updateObject(selectedObject.id, {
                              geometry: { ...selectedObject.geometry!, segments: parseInt(e.target.value) || 32 }
                            })}
                            className="h-8 text-sm"
                            step="1"
                            min="3"
                          />
                        </div>
                      </>
                    )}
                    
                    {selectedObject.primitiveType === 'cylinder' && (
                      <div>
                        <Label className="text-xs">Height</Label>
                        <Input
                          type="number"
                          value={selectedObject.geometry.height || 1}
                          onChange={(e) => updateObject(selectedObject.id, {
                            geometry: { ...selectedObject.geometry!, height: parseFloat(e.target.value) || 1 }
                          })}
                          className="h-8 text-sm"
                          step="0.1"
                          min="0.1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default ModelEditor