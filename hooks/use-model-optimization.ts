'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

interface ModelOptimizationOptions {
  enableLOD?: boolean
  maxDistance?: number
  compressionLevel?: 'low' | 'medium' | 'high'
  enableInstancing?: boolean
  enableFrustumCulling?: boolean
  textureResolution?: 'low' | 'medium' | 'high'
}

interface ModelStats {
  triangles: number
  vertices: number
  materials: number
  textures: number
  fileSize: number
  loadTime: number
}

interface OptimizedModel {
  scene: THREE.Group
  stats: ModelStats
  isOptimized: boolean
  optimizationLevel: string
}

export function useModelOptimization(
  modelUrl: string,
  options: ModelOptimizationOptions = {}
) {
  const {
    enableLOD = true,
    maxDistance = 100,
    compressionLevel = 'medium',
    enableInstancing = false,
    enableFrustumCulling = true,
    textureResolution = 'medium'
  } = options

  const [optimizedModel, setOptimizedModel] = useState<OptimizedModel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [progress, setProgress] = useState(0)
  
  const loadStartTime = useRef<number>(0)
  const originalModel = useRef<THREE.Group | null>(null)

  // Load original model
  const { scene: gltfScene } = useGLTF(modelUrl)

  // Calculate model statistics
  const calculateStats = useCallback((scene: THREE.Group): ModelStats => {
    let triangles = 0
    let vertices = 0
    let materials = 0
    let textures = 0
    const materialSet = new Set()
    const textureSet = new Set()

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry
        if (geometry.index) {
          triangles += geometry.index.count / 3
        } else {
          triangles += geometry.attributes.position.count / 3
        }
        vertices += geometry.attributes.position.count

        // Count unique materials
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => materialSet.add(mat.uuid))
          } else {
            materialSet.add(child.material.uuid)
          }
        }

        // Count textures
        const material = child.material
        if (material instanceof THREE.MeshStandardMaterial) {
          if (material.map) textureSet.add(material.map.uuid)
          if (material.normalMap) textureSet.add(material.normalMap.uuid)
          if (material.roughnessMap) textureSet.add(material.roughnessMap.uuid)
          if (material.metalnessMap) textureSet.add(material.metalnessMap.uuid)
          if (material.aoMap) textureSet.add(material.aoMap.uuid)
        }
      }
    })

    return {
      triangles: Math.round(triangles),
      vertices,
      materials: materialSet.size,
      textures: textureSet.size,
      fileSize: 0, // Will be calculated separately
      loadTime: Date.now() - loadStartTime.current
    }
  }, [])

  // Optimize geometry
  const optimizeGeometry = useCallback((geometry: THREE.BufferGeometry): THREE.BufferGeometry => {
    const optimized = geometry.clone()
    
    // Merge vertices
    optimized.mergeVertices()
    
    // Compute vertex normals if missing
    if (!optimized.attributes.normal) {
      optimized.computeVertexNormals()
    }
    
    // Compute bounding box and sphere
    optimized.computeBoundingBox()
    optimized.computeBoundingSphere()
    
    return optimized
  }, [])

  // Optimize textures based on resolution setting
  const optimizeTexture = useCallback((texture: THREE.Texture): THREE.Texture => {
    const optimized = texture.clone()
    
    // Set resolution based on quality
    const resolutionMap = {
      low: 512,
      medium: 1024,
      high: 2048
    }
    
    const maxSize = resolutionMap[textureResolution]
    
    // Configure texture settings
    optimized.generateMipmaps = textureResolution !== 'low'
    optimized.minFilter = textureResolution === 'low' 
      ? THREE.LinearFilter 
      : THREE.LinearMipmapLinearFilter
    optimized.magFilter = THREE.LinearFilter
    optimized.wrapS = THREE.RepeatWrapping
    optimized.wrapT = THREE.RepeatWrapping
    
    // Enable anisotropic filtering for better quality
    if (textureResolution === 'high') {
      optimized.anisotropy = 16
    }
    
    return optimized
  }, [textureResolution])

  // Create LOD (Level of Detail) system
  const createLOD = useCallback((scene: THREE.Group): THREE.LOD => {
    const lod = new THREE.LOD()
    
    // High detail (close)
    const highDetail = scene.clone()
    lod.addLevel(highDetail, 0)
    
    // Medium detail (medium distance)
    const mediumDetail = scene.clone()
    mediumDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Reduce geometry complexity for medium LOD
        const geometry = child.geometry
        if (geometry.index && geometry.index.count > 1000) {
          // Simple decimation by removing every nth triangle
          const indices = geometry.index.array
          const newIndices = []
          for (let i = 0; i < indices.length; i += 6) {
            newIndices.push(indices[i], indices[i + 1], indices[i + 2])
          }
          geometry.setIndex(newIndices)
        }
      }
    })
    lod.addLevel(mediumDetail, maxDistance * 0.3)
    
    // Low detail (far)
    const lowDetail = scene.clone()
    lowDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Further reduce geometry for low LOD
        const geometry = child.geometry
        if (geometry.index && geometry.index.count > 500) {
          const indices = geometry.index.array
          const newIndices = []
          for (let i = 0; i < indices.length; i += 12) {
            newIndices.push(indices[i], indices[i + 1], indices[i + 2])
          }
          geometry.setIndex(newIndices)
        }
      }
    })
    lod.addLevel(lowDetail, maxDistance * 0.7)
    
    return lod
  }, [maxDistance])

  // Main optimization function
  const optimizeModel = useCallback(async (scene: THREE.Group): Promise<OptimizedModel> => {
    setIsLoading(true)
    setProgress(0)
    loadStartTime.current = Date.now()
    
    try {
      const optimizedScene = scene.clone()
      let processedMeshes = 0
      const totalMeshes = scene.children.length
      
      // Optimize each mesh
      optimizedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Optimize geometry
          child.geometry = optimizeGeometry(child.geometry)
          
          // Optimize materials and textures
          if (child.material) {
            const material = child.material as THREE.MeshStandardMaterial
            
            if (material.map) {
              material.map = optimizeTexture(material.map)
            }
            if (material.normalMap) {
              material.normalMap = optimizeTexture(material.normalMap)
            }
            if (material.roughnessMap) {
              material.roughnessMap = optimizeTexture(material.roughnessMap)
            }
            if (material.metalnessMap) {
              material.metalnessMap = optimizeTexture(material.metalnessMap)
            }
          }
          
          // Enable frustum culling
          if (enableFrustumCulling) {
            child.frustumCulled = true
          }
          
          // Enable shadows based on compression level
          if (compressionLevel !== 'low') {
            child.castShadow = true
            child.receiveShadow = true
          }
          
          processedMeshes++
          setProgress((processedMeshes / totalMeshes) * 100)
        }
      })
      
      // Apply LOD if enabled
      let finalScene: THREE.Group
      if (enableLOD) {
        const lod = createLOD(optimizedScene)
        finalScene = new THREE.Group()
        finalScene.add(lod)
      } else {
        finalScene = optimizedScene
      }
      
      // Calculate final stats
      const stats = calculateStats(finalScene)
      
      const result: OptimizedModel = {
        scene: finalScene,
        stats,
        isOptimized: true,
        optimizationLevel: compressionLevel
      }
      
      setProgress(100)
      return result
      
    } catch (err) {
      throw new Error(`Optimization failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }, [
    optimizeGeometry,
    optimizeTexture,
    createLOD,
    calculateStats,
    enableLOD,
    enableFrustumCulling,
    compressionLevel
  ])

  // Effect to optimize model when it loads
  useEffect(() => {
    if (gltfScene && !originalModel.current) {
      originalModel.current = gltfScene
      
      optimizeModel(gltfScene)
        .then(setOptimizedModel)
        .catch(setError)
    }
  }, [gltfScene, optimizeModel])

  // Re-optimize when options change
  const reoptimize = useCallback(() => {
    if (originalModel.current) {
      setError(null)
      optimizeModel(originalModel.current)
        .then(setOptimizedModel)
        .catch(setError)
    }
  }, [optimizeModel])

  return {
    optimizedModel,
    isLoading,
    error,
    progress,
    reoptimize,
    originalStats: originalModel.current ? calculateStats(originalModel.current) : null
  }
}

export default useModelOptimization