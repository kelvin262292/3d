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
import Loader from './model-editor/Loader'
import SceneObjectComponent from './model-editor/SceneObjectComponent'
import SceneEnvironment from './model-editor/SceneEnvironment'
import HierarchyPanel from './model-editor/HierarchyPanel'
import Toolbar from './model-editor/Toolbar'
import PropertiesPanel from './model-editor/PropertiesPanel'

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
        <HierarchyPanel
          scene={scene}
          selectedObjects={selectedObjects}
          selectObject={selectObject}
          updateObject={updateObject}
          addPrimitive={addPrimitive}
        />
      )}
      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        {showToolbar && (
          <Toolbar
            saveScene={saveScene}
            loadScene={loadScene}
            exportScene={exportScene}
            importScene={importScene}
            fileInputRef={fileInputRef}
            undo={undo}
            redo={redo}
            historyIndex={historyIndex}
            historyLength={history.length}
            settings={settings}
            updateSetting={updateSetting}
            duplicateSelected={duplicateSelected}
            deleteSelected={deleteSelected}
            selectedObjects={selectedObjects}
            showHierarchy={showHierarchy}
            setShowHierarchy={setShowHierarchy}
            showProperties={showProperties}
            setShowProperties={setShowProperties}
          />
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
        <PropertiesPanel
          selectedObject={selectedObject}
          updateObject={updateObject}
        />
      )}
    </div>
  )
}

export default ModelEditor