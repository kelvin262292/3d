"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/hooks/use-language"
import { formatCurrency } from "@/lib/i18n"
import Image from "next/image"
import Link from "next/link"
import { logger } from "@/lib/logger"

// Mock data for search - now with multi-language support
const getMockProducts = (language: string) => [
  {
    id: "1",
    name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Residential" : language === "zh" ? "住宅" : "Nhà ở",
    price: 299000,
    originalPrice: 399000,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["villa", "modern", "architecture", "residential"]
        : language === "zh"
          ? ["别墅", "现代", "建筑", "住宅"]
          : ["villa", "hiện đại", "kiến trúc", "nhà ở"],
    format: "FBX",
    polygons: 15000,
    textures: true,
    rigged: false,
    animated: false,
    featured: true,
    discount: 25,
  },
  {
    id: "2",
    name: language === "en" ? "Ferrari Sports Car" : language === "zh" ? "法拉利跑车" : "Xe Thể Thao Ferrari",
    category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    subcategory: language === "en" ? "Sports Car" : language === "zh" ? "跑车" : "Xe thể thao",
    price: 450000,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["ferrari", "sports car", "vehicle", "luxury"]
        : language === "zh"
          ? ["法拉利", "跑车", "车辆", "豪华"]
          : ["ferrari", "xe thể thao", "xe hơi", "luxury"],
    format: "OBJ",
    polygons: 25000,
    textures: true,
    rigged: true,
    animated: true,
    featured: true,
  },
  {
    id: "3",
    name: language === "en" ? "Anime Girl Character" : language === "zh" ? "动漫女孩角色" : "Nhân Vật Anime Girl",
    category: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
    subcategory: language === "en" ? "Anime" : language === "zh" ? "动漫" : "Anime",
    price: 199000,
    rating: 4.7,
    reviews: 256,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["anime", "girl", "character", "manga"]
        : language === "zh"
          ? ["动漫", "女孩", "角色", "漫画"]
          : ["anime", "girl", "nhân vật", "manga"],
    format: "FBX",
    polygons: 8000,
    textures: true,
    rigged: true,
    animated: true,
    featured: false,
  },
  {
    id: "4",
    name: language === "en" ? "Mythical Dragon" : language === "zh" ? "神话龙" : "Rồng Thần Thoại",
    category: language === "en" ? "Creatures" : language === "zh" ? "生物" : "Sinh vật",
    subcategory: language === "en" ? "Mythology" : language === "zh" ? "神话" : "Thần thoại",
    price: 350000,
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["dragon", "mythology", "fantasy", "creature"]
        : language === "zh"
          ? ["龙", "神话", "奇幻", "生物"]
          : ["rồng", "thần thoại", "fantasy", "sinh vật"],
    format: "BLEND",
    polygons: 35000,
    textures: true,
    rigged: true,
    animated: true,
    featured: false,
  },
]

const getCategories = (language: string) => [
  {
    id: "architecture",
    name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    count: 156,
  },
  {
    id: "vehicles",
    name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    count: 89,
  },
  {
    id: "characters",
    name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
    count: 234,
  },
  {
    id: "creatures",
    name: language === "en" ? "Creatures" : language === "zh" ? "生物" : "Sinh vật",
    count: 67,
  },
  {
    id: "furniture",
    name: language === "en" ? "Furniture" : language === "zh" ? "家具" : "Nội thất",
    count: 123,
  },
  {
    id: "weapons",
    name: language === "en" ? "Weapons" : language === "zh" ? "武器" : "Vũ khí",
    count: 45,
  },
]

const formats = ["FBX", "OBJ", "BLEND", "MAX", "3DS", "DAE"]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language, t } = useLanguage()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [hasTextures, setHasTextures] = useState(false)
  const [isRigged, setIsRigged] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch products
        const productsResponse = await fetch('/api/products?limit=50')
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
        setTotalProducts(productsData.pagination?.total || 0)
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData || [])
        
        logger.info('Search data loaded successfully', 'UI', { 
          productsCount: productsData.products?.length || 0,
          categoriesCount: categoriesData?.length || 0
        })
      } catch (error) {
        logger.error('Failed to fetch search data', 'UI', { error })
        setError('Failed to load data')
        // Fallback to mock data
        setProducts(getMockProducts(language))
        setCategories(getCategories(language))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [language])

  // Keep mock data as fallback
  const mockProducts = getMockProducts(language)
  const mockCategories = getCategories(language)

  const sortOptions = [
    { value: "relevance", label: t.sort.relevance },
    { value: "newest", label: t.sort.newest },
    { value: "price-low", label: t.sort.price_low },
    { value: "price-high", label: t.sort.price_high },
    { value: "rating", label: t.sort.rating },
    { value: "popular", label: t.sort.popular },
  ]

  // Generate search suggestions
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    const dataToUse = products.length > 0 ? products : mockProducts
    dataToUse.forEach((product) => {
      // Handle both API and mock data structures
      if (product.tags) {
        if (Array.isArray(product.tags)) {
          product.tags.forEach((tag) => tags.add(tag))
        } else if (typeof product.tags === 'string') {
          product.tags.split(',').forEach((tag) => tags.add(tag.trim()))
        }
      }
      tags.add(product.name.toLowerCase())
      const categoryName = product.category?.name || product.category
      if (categoryName) {
        tags.add(categoryName.toLowerCase())
      }
      if (product.subcategory) {
        tags.add(product.subcategory.toLowerCase())
      }
    })
    return Array.from(tags)
  }, [products, mockProducts])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const dataToUse = products.length > 0 ? products : mockProducts
    let filtered = dataToUse.filter((product) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = product.name.toLowerCase().includes(query)
        const matchesTags = product.tags.some((tag) => tag.toLowerCase().includes(query))
        const categoryName = product.category?.name || product.category
        const matchesCategory = categoryName?.toLowerCase().includes(query)
        if (!matchesName && !matchesTags && !matchesCategory) return false
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const categoryName = product.category?.name || product.category
        if (!selectedCategories.includes(categoryName)) return false
      }

      // Price filter
      const productPrice = Number(product.price)
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) return false

      // Format filter
      if (selectedFormats.length > 0) {
        const productFormat = product.format || 'FBX' // Default format
        if (!selectedFormats.includes(productFormat)) return false
      }

      // Rating filter
      if (product.rating < minRating) return false

      // Feature filters
      if (hasTextures && !product.textures) return false
      if (isRigged && !product.rigged) return false
      if (isAnimated && !product.animated) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].reverse()
        break
      case "price-low":
        filtered = filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered = filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popular":
        filtered = filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        filtered = filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
    }

    return filtered
  }, [
    searchQuery,
    selectedCategories,
    priceRange,
    selectedFormats,
    minRating,
    hasTextures,
    isRigged,
    isAnimated,
    sortBy,
    mockProducts,
  ])

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    if (value.length > 1) {
      const filtered = allTags.filter((tag) => tag.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle search submit
  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery
    setShowSuggestions(false)

    const params = new URLSearchParams()
    if (searchTerm) params.set("q", searchTerm)
    router.push(`/search?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000000])
    setSelectedFormats([])
    setMinRating(0)
    setHasTextures(false)
    setIsRigged(false)
    setIsAnimated(false)
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedFormats.length +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (hasTextures ? 1 : 0) +
    (isRigged ? 1 : 0) +
    (isAnimated ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-[#0e1a13] mb-3">{t.filters.categories}</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category.name])
                  } else {
                    setSelectedCategories(selectedCategories.filter((c) => c !== category.name))
                  }
                }}
              />
              <Label htmlFor={category.id} className="flex-1 text-sm">
                {category.name}
              </Label>
              <span className="text-xs text-[#51946b]">({category.count})</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-[#0e1a13] mb-3">{t.filters.price_range}</h3>
        <div className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000000} step={10000} className="w-full" />
          <div className="flex items-center justify-between text-sm text-[#51946b]">
            <span>{formatCurrency(priceRange[0], language)}</span>
            <span>{formatCurrency(priceRange[1], language)}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* File Formats */}
      <div>
        <h3 className="font-semibold text-[#0e1a13] mb-3">{t.filters.file_format}</h3>
        <div className="space-y-2">
          {formats.map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={format}
                checked={selectedFormats.includes(format)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedFormats([...selectedFormats, format])
                  } else {
                    setSelectedFormats(selectedFormats.filter((f) => f !== format))
                  }
                }}
              />
              <Label htmlFor={format} className="text-sm">
                {format}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-[#0e1a13] mb-3">{t.filters.min_rating}</h3>
        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder={t.filters.all_ratings} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">{t.filters.all_ratings}</SelectItem>
            <SelectItem value="4">4+ ⭐</SelectItem>
            <SelectItem value="4.5">4.5+ ⭐</SelectItem>
            <SelectItem value="4.8">4.8+ ⭐</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <h3 className="font-semibold text-[#0e1a13] mb-3">{t.filters.features}</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="textures" checked={hasTextures} onCheckedChange={setHasTextures} />
            <Label htmlFor="textures" className="text-sm">
              {t.filters.has_textures}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="rigged" checked={isRigged} onCheckedChange={setIsRigged} />
            <Label htmlFor="rigged" className="text-sm">
              {t.filters.has_rigging}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="animated" checked={isAnimated} onCheckedChange={setIsAnimated} />
            <Label htmlFor="animated" className="text-sm">
              {t.filters.has_animation}
            </Label>
          </div>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full">
            {t.filters.clear_filters} ({activeFiltersCount})
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
              <Input
                type="text"
                placeholder={t.search.placeholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-4 h-12 bg-white border-[#d1e6d9] focus:border-[#39e079] rounded-xl"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setShowSuggestions(false)
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 border-[#d1e6d9]">
                <CardContent className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        handleSearch(suggestion)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#e8f2ec] rounded-lg text-sm transition-colors"
                    >
                      <Search className="inline w-4 h-4 mr-2 text-[#51946b]" />
                      {suggestion}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search Results Info */}
          <div className="text-center text-[#51946b]">
            {searchQuery ? (
              <p>
                {t.search.results_found.replace("{count}", filteredProducts.length.toString())}{" "}
                <span className="font-semibold text-[#0e1a13]">{filteredProducts.length}</span> {t.search.results_for} "
                {searchQuery}"
              </p>
            ) : (
              <p>
                {t.search.showing_products}{" "}
                <span className="font-semibold text-[#0e1a13]">{filteredProducts.length}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="border-[#d1e6d9] sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#0e1a13]">{t.search.filters}</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="bg-[#39e079] text-[#0e1a13]">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-[#d1e6d9]">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden border-[#d1e6d9]">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      {t.search.filters}
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-[#39e079] text-[#0e1a13]">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>{t.search.filters}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-[#d1e6d9]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90" : "border-[#d1e6d9]"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list" ? "bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90" : "border-[#d1e6d9]"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="bg-[#e8f2ec] text-[#0e1a13]">
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
                        className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                  {selectedFormats.map((format) => (
                    <Badge key={format} variant="secondary" className="bg-[#e8f2ec] text-[#0e1a13]">
                      {format}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFormats(selectedFormats.filter((f) => f !== format))}
                        className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                    <Badge variant="secondary" className="bg-[#e8f2ec] text-[#0e1a13]">
                      {formatCurrency(priceRange[0], language)} - {formatCurrency(priceRange[1], language)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPriceRange([0, 1000000])}
                        className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {[...Array(8)].map((_, index) => (
                  <Card key={index} className="border-[#d1e6d9] animate-pulse">
                    <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}>
                      <div className={viewMode === "grid" ? "" : "w-32 flex-shrink-0"}>
                        <div className="bg-gray-200 aspect-square mb-3 rounded-lg"></div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-gray-200 h-6 rounded w-2/3"></div>
                        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                        <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                        <div className="flex gap-2">
                          <div className="bg-gray-200 h-4 rounded w-12"></div>
                          <div className="bg-gray-200 h-4 rounded w-12"></div>
                        </div>
                        <div className="bg-gray-200 h-8 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">{error}</h3>
                <Button onClick={() => window.location.reload()} className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                  {language === "en" ? "Retry" : language === "zh" ? "重试" : "Thử lại"}
                </Button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="border-[#d1e6d9] hover:shadow-lg transition-shadow">
                    <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex gap-4"}>
                      <div className={viewMode === "grid" ? "" : "w-32 flex-shrink-0"}>
                        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                          <Image
                            src={product.imageUrl || product.images?.[0] || product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                          {product.discount && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{product.discount}%</Badge>
                          )}
                          {product.featured && (
                            <Badge className="absolute top-2 right-2 bg-[#39e079] text-[#0e1a13]">
                              {language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <Link href={`/products/${product.slug || product.id}`}>
                          <h3 className="font-semibold text-[#0e1a13] mb-2 hover:text-[#39e079] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-[#51946b] ml-1">
                              {product.rating} ({product.downloads || product.reviews || 0})
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {product.format || 'FBX'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-[#0e1a13]">{formatCurrency(Number(product.price), language)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-[#51946b] line-through">
                              {formatCurrency(Number(product.originalPrice), language)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {(product.tags ? 
                            (Array.isArray(product.tags) ? product.tags : product.tags.split(',').map(t => t.trim()))
                            : []
                          ).slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-[#e8f2ec] text-[#51946b]">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                            {language === "en" ? "Add to Cart" : language === "zh" ? "加入购物车" : "Thêm vào giỏ"}
                          </Button>
                          <Button variant="outline" size="sm" className="border-[#d1e6d9]">
                            ♡
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">
                  {language === "en" ? "No results found" : language === "zh" ? "未找到结果" : "Không tìm thấy kết quả"}
                </h3>
                <p className="text-[#51946b] mb-4">
                  {language === "en" ? "Try adjusting your search or filters" : language === "zh" ? "尝试调整搜索或筛选条件" : "Thử điều chỉnh tìm kiếm hoặc bộ lọc"}
                </p>
                <Button onClick={clearFilters} className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                  {language === "en" ? "Clear Filters" : language === "zh" ? "清除筛选" : "Xóa bộ lọc"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
