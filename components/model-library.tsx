'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  StarOff,
  Tag,
  Calendar,
  FileText,
  Image,
  Box,
  Folder,
  FolderPlus,
  MoreVertical,
  SortAsc,
  SortDesc,
  RefreshCw,
  Share2,
  Copy,
  ExternalLink,
  Info,
  Settings,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Archive,
  Clock,
  User,
  Globe,
  Lock,
  Unlock,
  Heart,
  MessageSquare,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { OptimizedModelLoader, ModelCacheManager } from '@/lib/model-utils'

interface ModelAsset {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  fileUrl: string
  thumbnailUrl?: string
  previewUrl?: string
  fileSize: number
  format: string
  author: string
  license: 'free' | 'premium' | 'commercial' | 'personal'
  rating: number
  downloads: number
  views: number
  comments: number
  favorites: number
  createdAt: Date
  updatedAt: Date
  version: string
  isPublic: boolean
  isFeatured: boolean
  complexity: 'low' | 'medium' | 'high'
  polyCount: number
  textureCount: number
  animationCount: number
  metadata: {
    dimensions: { width: number; height: number; depth: number }
    materials: string[]
    textures: string[]
    animations: string[]
    rigged: boolean
    pbr: boolean
  }
  collections: string[]
  relatedModels: string[]
}

interface ModelCollection {
  id: string
  name: string
  description: string
  thumbnail?: string
  modelIds: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  author: string
  tags: string[]
}

interface FilterOptions {
  category: string
  license: string
  complexity: string
  format: string
  author: string
  minRating: number
  maxFileSize: number
  hasAnimations: boolean
  isPBR: boolean
  isRigged: boolean
  dateRange: { start: Date | null; end: Date | null }
  tags: string[]
}

interface SortOptions {
  field: 'name' | 'createdAt' | 'rating' | 'downloads' | 'fileSize' | 'polyCount'
  direction: 'asc' | 'desc'
}

interface ModelLibraryProps {
  models?: ModelAsset[]
  collections?: ModelCollection[]
  onModelSelect?: (model: ModelAsset) => void
  onModelDownload?: (model: ModelAsset) => void
  onModelUpload?: (model: Partial<ModelAsset>) => void
  onModelEdit?: (model: ModelAsset) => void
  onModelDelete?: (modelId: string) => void
  onCollectionCreate?: (collection: Partial<ModelCollection>) => void
  onCollectionEdit?: (collection: ModelCollection) => void
  onCollectionDelete?: (collectionId: string) => void
  allowUpload?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  viewMode?: 'grid' | 'list'
  className?: string
}

const defaultFilters: FilterOptions = {
  category: '',
  license: '',
  complexity: '',
  format: '',
  author: '',
  minRating: 0,
  maxFileSize: 0,
  hasAnimations: false,
  isPBR: false,
  isRigged: false,
  dateRange: { start: null, end: null },
  tags: []
}

const defaultSort: SortOptions = {
  field: 'createdAt',
  direction: 'desc'
}

// Mock data for demonstration
const mockModels: ModelAsset[] = [
  {
    id: '1',
    name: 'Modern Villa',
    description: 'A beautiful modern villa with clean lines and contemporary design',
    category: 'Architecture',
    tags: ['villa', 'modern', 'residential', 'luxury'],
    fileUrl: '/models/modern-villa.glb',
    thumbnailUrl: '/images/villa-thumb.jpg',
    fileSize: 15728640, // 15MB
    format: 'GLB',
    author: 'ArchStudio',
    license: 'free',
    rating: 4.8,
    downloads: 1250,
    views: 5420,
    comments: 23,
    favorites: 89,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    version: '1.2',
    isPublic: true,
    isFeatured: true,
    complexity: 'medium',
    polyCount: 45000,
    textureCount: 8,
    animationCount: 0,
    metadata: {
      dimensions: { width: 20, height: 8, depth: 15 },
      materials: ['Concrete', 'Glass', 'Steel'],
      textures: ['Diffuse', 'Normal', 'Roughness', 'Metallic'],
      animations: [],
      rigged: false,
      pbr: true
    },
    collections: ['Featured', 'Architecture'],
    relatedModels: ['2', '3']
  },
  {
    id: '2',
    name: 'Sports Car',
    description: 'High-performance sports car with detailed interior',
    category: 'Vehicles',
    tags: ['car', 'sports', 'vehicle', 'racing'],
    fileUrl: '/models/sports-car.glb',
    thumbnailUrl: '/images/car-thumb.jpg',
    fileSize: 8388608, // 8MB
    format: 'GLB',
    author: 'CarDesigner',
    license: 'premium',
    rating: 4.9,
    downloads: 890,
    views: 3210,
    comments: 15,
    favorites: 67,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    version: '1.0',
    isPublic: true,
    isFeatured: false,
    complexity: 'high',
    polyCount: 78000,
    textureCount: 12,
    animationCount: 2,
    metadata: {
      dimensions: { width: 4.5, height: 1.3, depth: 2.1 },
      materials: ['Paint', 'Chrome', 'Rubber', 'Glass'],
      textures: ['Diffuse', 'Normal', 'Roughness', 'Metallic', 'Emission'],
      animations: ['Door Open', 'Wheel Rotation'],
      rigged: true,
      pbr: true
    },
    collections: ['Vehicles', 'Premium'],
    relatedModels: ['4', '5']
  }
]

const mockCollections: ModelCollection[] = [
  {
    id: '1',
    name: 'Featured Models',
    description: 'Our top-rated and most popular 3D models',
    thumbnail: '/images/featured-collection.jpg',
    modelIds: ['1'],
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-01'),
    author: 'Admin',
    tags: ['featured', 'popular']
  },
  {
    id: '2',
    name: 'Architecture Collection',
    description: 'Buildings, houses, and architectural elements',
    thumbnail: '/images/architecture-collection.jpg',
    modelIds: ['1'],
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    author: 'ArchStudio',
    tags: ['architecture', 'buildings']
  }
]

function ModelPreview({ model, onClose }: { model: ModelAsset; onClose: () => void }) {
  const [modelObject, setModelObject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loader = new OptimizedModelLoader()
    loader.load(model.fileUrl)
      .then(result => {
        setModelObject(result)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load model:', error)
        setLoading(false)
      })
  }, [model.fileUrl])
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{model.name}</DialogTitle>
          <DialogDescription>{model.description}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
                <Environment preset="studio" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                
                {modelObject && (
                  <primitive object={modelObject.scene.clone()} />
                )}
                
                <OrbitControls enablePan enableZoom enableRotate />
              </Canvas>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm text-muted-foreground">{model.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Format</Label>
                <p className="text-sm text-muted-foreground">{model.format}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">File Size</Label>
                <p className="text-sm text-muted-foreground">
                  {(model.fileSize / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Polygons</Label>
                <p className="text-sm text-muted-foreground">
                  {model.polyCount.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Rating</Label>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{model.rating}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Downloads</Label>
                <p className="text-sm text-muted-foreground">
                  {model.downloads.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {model.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Materials</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {model.metadata.materials.map(material => (
                  <Badge key={material} variant="outline" className="text-xs">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Features</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {model.metadata.pbr && (
                  <Badge variant="secondary" className="text-xs">
                    PBR
                  </Badge>
                )}
                {model.metadata.rigged && (
                  <Badge variant="secondary" className="text-xs">
                    Rigged
                  </Badge>
                )}
                {model.animationCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Animated
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ModelCard({ 
  model, 
  viewMode, 
  onSelect, 
  onPreview, 
  onEdit, 
  onDelete, 
  allowEdit, 
  allowDelete 
}: {
  model: ModelAsset
  viewMode: 'grid' | 'list'
  onSelect: (model: ModelAsset) => void
  onPreview: (model: ModelAsset) => void
  onEdit?: (model: ModelAsset) => void
  onDelete?: (modelId: string) => void
  allowEdit?: boolean
  allowDelete?: boolean
}) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          {model.thumbnailUrl ? (
            <img 
              src={model.thumbnailUrl} 
              alt={model.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Box className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{model.name}</h3>
            {model.isFeatured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {model.license}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{model.description}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <span>{model.category}</span>
            <span>{(model.fileSize / 1024 / 1024).toFixed(1)} MB</span>
            <span>{model.polyCount.toLocaleString()} polys</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{model.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPreview(model)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSelect(model)}>
            <Download className="w-4 h-4" />
          </Button>
          {allowEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(model)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {allowDelete && onDelete && (
            <Button variant="outline" size="sm" onClick={() => onDelete(model.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
        {model.thumbnailUrl ? (
          <img 
            src={model.thumbnailUrl} 
            alt={model.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Box className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onPreview(model)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onSelect(model)}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {model.isFeatured && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            Featured
          </Badge>
        )}
        
        <Badge className="absolute top-2 right-2" variant="outline">
          {model.license}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{model.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{model.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{model.description}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{model.category}</span>
            <span>{(model.fileSize / 1024 / 1024).toFixed(1)} MB</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {model.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {model.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{model.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {model.downloads}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {model.favorites}
              </span>
            </div>
            
            {(allowEdit || allowDelete) && (
              <div className="flex gap-1">
                {allowEdit && onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(model)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
                {allowDelete && onDelete && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(model.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterPanel({ 
  filters, 
  onFiltersChange, 
  categories, 
  authors, 
  tags 
}: {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  categories: string[]
  authors: string[]
  tags: string[]
}) {
  const updateFilter = <K extends keyof FilterOptions>(
    key: K, 
    value: FilterOptions[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value })
  }
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium">Category</Label>
        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm font-medium">License</Label>
        <Select value={filters.license} onValueChange={(value) => updateFilter('license', value)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="All licenses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All licenses</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Complexity</Label>
        <Select value={filters.complexity} onValueChange={(value) => updateFilter('complexity', value)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="All complexity levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All complexity levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Author</Label>
        <Select value={filters.author} onValueChange={(value) => updateFilter('author', value)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="All authors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All authors</SelectItem>
            {authors.map(author => (
              <SelectItem key={author} value={author}>{author}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <Select 
          value={filters.minRating.toString()} 
          onValueChange={(value) => updateFilter('minRating', parseFloat(value))}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any rating</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="4.5">4.5+ stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Has Animations</Label>
          <Switch
            checked={filters.hasAnimations}
            onCheckedChange={(checked) => updateFilter('hasAnimations', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">PBR Materials</Label>
          <Switch
            checked={filters.isPBR}
            onCheckedChange={(checked) => updateFilter('isPBR', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Rigged</Label>
          <Switch
            checked={filters.isRigged}
            onCheckedChange={(checked) => updateFilter('isRigged', checked)}
          />
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Tags</Label>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 20).map(tag => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => {
                const newTags = filters.tags.includes(tag)
                  ? filters.tags.filter(t => t !== tag)
                  : [...filters.tags, tag]
                updateFilter('tags', newTags)
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => onFiltersChange(defaultFilters)}
      >
        Clear Filters
      </Button>
    </div>
  )
}

export function ModelLibrary({
  models = mockModels,
  collections = mockCollections,
  onModelSelect,
  onModelDownload,
  onModelUpload,
  onModelEdit,
  onModelDelete,
  onCollectionCreate,
  onCollectionEdit,
  onCollectionDelete,
  allowUpload = false,
  allowEdit = false,
  allowDelete = false,
  viewMode: initialViewMode = 'grid',
  className = ''
}: ModelLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [sort, setSort] = useState<SortOptions>(defaultSort)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [selectedModel, setSelectedModel] = useState<ModelAsset | null>(null)
  const [previewModel, setPreviewModel] = useState<ModelAsset | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('models')
  
  // Extract unique values for filters
  const categories = useMemo(() => 
    [...new Set(models.map(model => model.category))], [models]
  )
  
  const authors = useMemo(() => 
    [...new Set(models.map(model => model.author))], [models]
  )
  
  const allTags = useMemo(() => 
    [...new Set(models.flatMap(model => model.tags))], [models]
  )
  
  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = models.filter(model => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.tags.some(tag => tag.toLowerCase().includes(query)) ||
          model.author.toLowerCase().includes(query)
        
        if (!matchesSearch) return false
      }
      
      // Category filter
      if (filters.category && model.category !== filters.category) return false
      
      // License filter
      if (filters.license && model.license !== filters.license) return false
      
      // Complexity filter
      if (filters.complexity && model.complexity !== filters.complexity) return false
      
      // Author filter
      if (filters.author && model.author !== filters.author) return false
      
      // Rating filter
      if (filters.minRating > 0 && model.rating < filters.minRating) return false
      
      // File size filter
      if (filters.maxFileSize > 0 && model.fileSize > filters.maxFileSize) return false
      
      // Feature filters
      if (filters.hasAnimations && model.animationCount === 0) return false
      if (filters.isPBR && !model.metadata.pbr) return false
      if (filters.isRigged && !model.metadata.rigged) return false
      
      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => model.tags.includes(tag))
        if (!hasMatchingTag) return false
      }
      
      return true
    })
    
    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sort.field]
      let bValue: any = b[sort.field]
      
      if (sort.field === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    return filtered
  }, [models, searchQuery, filters, sort])
  
  const handleModelSelect = (model: ModelAsset) => {
    setSelectedModel(model)
    if (onModelSelect) {
      onModelSelect(model)
    }
    if (onModelDownload) {
      onModelDownload(model)
    }
  }
  
  const handleModelPreview = (model: ModelAsset) => {
    setPreviewModel(model)
  }
  
  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        showFilters ? 'w-80' : 'w-0'
      } overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFilters(false)}
            >
              ×
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-120px)]">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              authors={authors}
              tags={allTags}
            />
          </ScrollArea>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Model Library</h1>
            
            <div className="flex items-center gap-2">
              {allowUpload && (
                <Button onClick={() => onModelUpload?.({})}>>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Model
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search models, tags, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select 
              value={`${sort.field}-${sort.direction}`} 
              onValueChange={(value) => {
                const [field, direction] = value.split('-') as [SortOptions['field'], SortOptions['direction']]
                setSort({ field, direction })
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="downloads-desc">Most Downloaded</SelectItem>
                <SelectItem value="fileSize-asc">Smallest File</SelectItem>
                <SelectItem value="fileSize-desc">Largest File</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border border-gray-200 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="models">Models ({filteredModels.length})</TabsTrigger>
              <TabsTrigger value="collections">Collections ({collections.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="models">
              {filteredModels.length === 0 ? (
                <div className="text-center py-12">
                  <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('')
                    setFilters(defaultFilters)
                  }}>
                    Clear Search & Filters
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                  : 'space-y-4'
                }>
                  {filteredModels.map(model => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      viewMode={viewMode}
                      onSelect={handleModelSelect}
                      onPreview={handleModelPreview}
                      onEdit={onModelEdit}
                      onDelete={onModelDelete}
                      allowEdit={allowEdit}
                      allowDelete={allowDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="collections">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {collections.map(collection => (
                  <Card key={collection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                      {collection.thumbnail ? (
                        <img 
                          src={collection.thumbnail} 
                          alt={collection.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Folder className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{collection.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {collection.modelIds.length} models
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {collection.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>by {collection.author}</span>
                          <span>{collection.createdAt.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {collection.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Model Preview Modal */}
      {previewModel && (
        <ModelPreview 
          model={previewModel} 
          onClose={() => setPreviewModel(null)} 
        />
      )}
    </div>
  )
}

export default ModelLibrary