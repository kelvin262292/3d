import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// Model cache interface
interface ModelCacheEntry {
  scene: THREE.Group
  timestamp: number
  size: number
  optimized: boolean
}

// Model optimization settings
export interface ModelOptimizationSettings {
  maxTextureSize: number
  enableCompression: boolean
  enableLOD: boolean
  maxCacheSize: number // in MB
  enableInstancing: boolean
}

// Default optimization settings
export const DEFAULT_OPTIMIZATION_SETTINGS: ModelOptimizationSettings = {
  maxTextureSize: 1024,
  enableCompression: true,
  enableLOD: true,
  maxCacheSize: 100, // 100MB
  enableInstancing: false
}

// Model cache manager
class ModelCacheManager {
  private cache = new Map<string, ModelCacheEntry>()
  private currentSize = 0 // in bytes
  private maxSize: number

  constructor(maxSizeMB: number = 100) {
    this.maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
  }

  set(key: string, scene: THREE.Group, optimized: boolean = false): void {
    const size = this.calculateSceneSize(scene)
    
    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!
      this.currentSize -= oldEntry.size
    }

    // Clean cache if needed
    this.cleanCache(size)

    // Add new entry
    this.cache.set(key, {
      scene: scene.clone(),
      timestamp: Date.now(),
      size,
      optimized
    })
    
    this.currentSize += size
  }

  get(key: string): THREE.Group | null {
    const entry = this.cache.get(key)
    if (entry) {
      // Update timestamp for LRU
      entry.timestamp = Date.now()
      return entry.scene.clone()
    }
    return null
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  private calculateSceneSize(scene: THREE.Group): number {
    let size = 0
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Calculate geometry size
        const geometry = child.geometry
        if (geometry.attributes.position) {
          size += geometry.attributes.position.array.byteLength
        }
        if (geometry.attributes.normal) {
          size += geometry.attributes.normal.array.byteLength
        }
        if (geometry.attributes.uv) {
          size += geometry.attributes.uv.array.byteLength
        }
        if (geometry.index) {
          size += geometry.index.array.byteLength
        }

        // Calculate texture size (approximate)
        const material = child.material
        if (material instanceof THREE.MeshStandardMaterial) {
          if (material.map) {
            size += this.estimateTextureSize(material.map)
          }
          if (material.normalMap) {
            size += this.estimateTextureSize(material.normalMap)
          }
          if (material.roughnessMap) {
            size += this.estimateTextureSize(material.roughnessMap)
          }
        }
      }
    })
    
    return size
  }

  private estimateTextureSize(texture: THREE.Texture): number {
    const image = texture.image
    if (image && image.width && image.height) {
      // Assume 4 bytes per pixel (RGBA)
      return image.width * image.height * 4
    }
    return 1024 * 1024 * 4 // Default 1MB estimate
  }

  private cleanCache(requiredSize: number): void {
    // Remove oldest entries until we have enough space
    while (this.currentSize + requiredSize > this.maxSize && this.cache.size > 0) {
      let oldestKey = ''
      let oldestTime = Date.now()
      
      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp
          oldestKey = key
        }
      }
      
      if (oldestKey) {
        const entry = this.cache.get(oldestKey)!
        this.currentSize -= entry.size
        this.cache.delete(oldestKey)
      }
    }
  }

  getCacheStats() {
    return {
      entries: this.cache.size,
      currentSize: this.currentSize,
      maxSize: this.maxSize,
      utilization: (this.currentSize / this.maxSize) * 100
    }
  }
}

// Global cache instance
export const modelCache = new ModelCacheManager()

// Model loader with optimization
export class OptimizedModelLoader {
  private loader: GLTFLoader
  private dracoLoader: DRACOLoader
  private settings: ModelOptimizationSettings

  constructor(settings: ModelOptimizationSettings = DEFAULT_OPTIMIZATION_SETTINGS) {
    this.settings = settings
    
    // Setup DRACO loader
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/draco/')
    
    // Setup GLTF loader
    this.loader = new GLTFLoader()
    if (settings.enableCompression) {
      this.loader.setDRACOLoader(this.dracoLoader)
    }
  }

  async load(url: string, forceReload: boolean = false): Promise<THREE.Group> {
    const cacheKey = `${url}_${JSON.stringify(this.settings)}`
    
    // Check cache first
    if (!forceReload && modelCache.has(cacheKey)) {
      const cached = modelCache.get(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      // Load model
      const gltf = await new Promise<any>((resolve, reject) => {
        this.loader.load(
          url,
          resolve,
          undefined,
          reject
        )
      })

      // Optimize the loaded model
      const optimizedScene = await this.optimizeScene(gltf.scene)
      
      // Cache the optimized model
      modelCache.set(cacheKey, optimizedScene, true)
      
      return optimizedScene
      
    } catch (error) {
      throw new Error(`Failed to load model from ${url}: ${error}`)
    }
  }

  private async optimizeScene(scene: THREE.Group): Promise<THREE.Group> {
    const optimized = scene.clone()
    
    optimized.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Optimize geometry
        this.optimizeGeometry(child.geometry)
        
        // Optimize materials
        if (child.material) {
          this.optimizeMaterial(child.material as THREE.Material)
        }
        
        // Enable optimizations
        child.frustumCulled = true
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    
    return optimized
  }

  private optimizeGeometry(geometry: THREE.BufferGeometry): void {
    // Merge vertices
    geometry.mergeVertices()
    
    // Compute normals if missing
    if (!geometry.attributes.normal) {
      geometry.computeVertexNormals()
    }
    
    // Compute bounding box and sphere
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()
    
    // Dispose of unnecessary attributes
    if (geometry.attributes.uv2) {
      geometry.deleteAttribute('uv2')
    }
  }

  private optimizeMaterial(material: THREE.Material): void {
    if (material instanceof THREE.MeshStandardMaterial) {
      // Optimize textures
      if (material.map) {
        this.optimizeTexture(material.map)
      }
      if (material.normalMap) {
        this.optimizeTexture(material.normalMap)
      }
      if (material.roughnessMap) {
        this.optimizeTexture(material.roughnessMap)
      }
      if (material.metalnessMap) {
        this.optimizeTexture(material.metalnessMap)
      }
      if (material.aoMap) {
        this.optimizeTexture(material.aoMap)
      }
    }
  }

  private optimizeTexture(texture: THREE.Texture): void {
    // Set appropriate filters
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = true
    
    // Enable anisotropic filtering
    texture.anisotropy = Math.min(16, THREE.WebGLRenderer.prototype.capabilities?.getMaxAnisotropy?.() || 1)
    
    // Set wrapping
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
  }

  dispose(): void {
    this.dracoLoader.dispose()
  }
}

// Utility functions
export function createLOD(scene: THREE.Group, distances: number[] = [0, 50, 100]): THREE.LOD {
  const lod = new THREE.LOD()
  
  distances.forEach((distance, index) => {
    const levelScene = scene.clone()
    
    // Reduce detail based on distance
    const reductionFactor = index * 0.3
    levelScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Simplify geometry for distant LODs
        if (index > 0) {
          const geometry = child.geometry
          if (geometry.index) {
            const originalCount = geometry.index.count
            const targetCount = Math.floor(originalCount * (1 - reductionFactor))
            
            // Simple decimation (remove every nth triangle)
            const step = Math.ceil(originalCount / targetCount)
            const newIndices = []
            
            for (let i = 0; i < originalCount; i += step * 3) {
              if (i + 2 < originalCount) {
                newIndices.push(
                  geometry.index.array[i],
                  geometry.index.array[i + 1],
                  geometry.index.array[i + 2]
                )
              }
            }
            
            geometry.setIndex(newIndices)
          }
        }
      }
    })
    
    lod.addLevel(levelScene, distance)
  })
  
  return lod
}

export function calculateModelComplexity(scene: THREE.Group): {
  triangles: number
  vertices: number
  materials: number
  textures: number
  complexity: 'low' | 'medium' | 'high'
} {
  let triangles = 0
  let vertices = 0
  const materials = new Set()
  const textures = new Set()
  
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry
      
      if (geometry.index) {
        triangles += geometry.index.count / 3
      } else {
        triangles += geometry.attributes.position.count / 3
      }
      
      vertices += geometry.attributes.position.count
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => materials.add(mat.uuid))
        } else {
          materials.add(child.material.uuid)
        }
        
        // Count textures
        const material = child.material as THREE.MeshStandardMaterial
        if (material.map) textures.add(material.map.uuid)
        if (material.normalMap) textures.add(material.normalMap.uuid)
        if (material.roughnessMap) textures.add(material.roughnessMap.uuid)
        if (material.metalnessMap) textures.add(material.metalnessMap.uuid)
      }
    }
  })
  
  // Determine complexity
  let complexity: 'low' | 'medium' | 'high' = 'low'
  if (triangles > 100000 || textures.size > 10) {
    complexity = 'high'
  } else if (triangles > 10000 || textures.size > 5) {
    complexity = 'medium'
  }
  
  return {
    triangles: Math.round(triangles),
    vertices,
    materials: materials.size,
    textures: textures.size,
    complexity
  }
}

export function preloadModels(urls: string[], settings?: ModelOptimizationSettings): Promise<void[]> {
  const loader = new OptimizedModelLoader(settings)
  
  return Promise.all(
    urls.map(url => 
      loader.load(url).then(() => {
        // Model is now cached
      })
    )
  )
}

// Performance monitoring
export class ModelPerformanceMonitor {
  private metrics = {
    loadTimes: [] as number[],
    renderTimes: [] as number[],
    memoryUsage: [] as number[]
  }

  recordLoadTime(time: number): void {
    this.metrics.loadTimes.push(time)
    if (this.metrics.loadTimes.length > 100) {
      this.metrics.loadTimes.shift()
    }
  }

  recordRenderTime(time: number): void {
    this.metrics.renderTimes.push(time)
    if (this.metrics.renderTimes.length > 100) {
      this.metrics.renderTimes.shift()
    }
  }

  recordMemoryUsage(usage: number): void {
    this.metrics.memoryUsage.push(usage)
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage.shift()
    }
  }

  getAverageLoadTime(): number {
    const times = this.metrics.loadTimes
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }

  getAverageRenderTime(): number {
    const times = this.metrics.renderTimes
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  }

  getAverageMemoryUsage(): number {
    const usage = this.metrics.memoryUsage
    return usage.length > 0 ? usage.reduce((a, b) => a + b, 0) / usage.length : 0
  }

  getMetrics() {
    return {
      averageLoadTime: this.getAverageLoadTime(),
      averageRenderTime: this.getAverageRenderTime(),
      averageMemoryUsage: this.getAverageMemoryUsage(),
      cacheStats: modelCache.getCacheStats()
    }
  }
}

export const performanceMonitor = new ModelPerformanceMonitor()