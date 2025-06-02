"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Grid, List, SlidersHorizontal, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Category, Product } from "@/types/api"
import { logger } from "@/lib/logger"

// API functions
async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/categories/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch category')
    }
    const data = await response.json()
    return data.category || null
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

async function fetchProductsByCategory(categoryId: string, params: {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  minPrice?: number
  maxPrice?: number
  search?: string
} = {}): Promise<{ products: Product[], total: number }> {
  try {
    const searchParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 12).toString(),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
      ...(params.minPrice && { minPrice: params.minPrice.toString() }),
      ...(params.maxPrice && { maxPrice: params.maxPrice.toString() }),
      ...(params.search && { search: params.search }),
    })

    const response = await fetch(`/api/categories/${categoryId}/products?${searchParams}`)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const data = await response.json()
    return {
      products: data.products || [],
      total: data.total || 0
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0 }
  }
}

// Helper functions for display names
const getCategoryDisplayName = (category: Category, lang: string) => {
  if (lang === 'vi' && category.name_vi) return category.name_vi
  return category.name
}

const getCategoryDescription = (category: Category, lang: string) => {
  if (lang === 'vi' && category.description_vi) return category.description_vi
  return category.description || ''
}

const getProductDisplayName = (product: Product, lang: string) => {
  if (lang === 'vi' && product.name_vi) return product.name_vi
  return product.name
}

const getProductDescription = (product: Product, lang: string) => {
  if (lang === 'vi' && product.description_vi) return product.description_vi
  return product.description || ''
}

// Fallback mock data for when API fails
const getFallbackProducts = (language: string): Product[] => [
  {
    id: "fallback-1",
    name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
    slug: "modern-villa-3d",
    description: language === "en" 
      ? "High-quality modern villa 3D model with detailed textures and realistic materials."
      : language === "zh"
      ? "高质量现代别墅3D模型，具有详细纹理和逼真材质。"
      : "Mô hình 3D biệt thự hiện đại chất lượng cao với kết cấu chi tiết và vật liệu thực tế.",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    downloads: 2340,
    imageUrl: "/placeholder.svg?height=300&width=300",
    images: ["/placeholder.svg?height=300&width=300"],
    format: "FBX",
    fileSize: "45.2 MB",
    polygons: 125000,
    vertices: 89000,
    tags: "modern,villa,architecture",
    featured: true,
    specifications: {
      hasTextures: true,
      isRigged: false,
      isAnimated: false
    },
    animated: false,
    category: {
      id: "1",
      name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      slug: "architecture"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const formats = ["FBX", "OBJ", "BLEND", "MAX", "3DS", "DAE"]

export default function CategoryDetailPage() {
  const params = useParams()
  const { language, t } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [hasTextures, setHasTextures] = useState(false)
  const [isRigged, setIsRigged] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  // API state
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      if (!params.id) return
      
      setIsLoading(true)
      setError(null)
      try {
        logger.info('Loading category', { categoryId: params.id })
        const categoryData = await fetchCategoryById(params.id as string)
        if (categoryData) {
          setCategory(categoryData)
          logger.info('Category loaded successfully', { category: categoryData.name })
        } else {
          const errorMsg = language === 'vi' ? 'Không tìm thấy danh mục' : 'Category not found'
          setError(errorMsg)
          logger.warn('Category not found', { categoryId: params.id })
        }
      } catch (error) {
        logger.error('Error loading category', { error, categoryId: params.id })
        const errorMsg = language === 'vi' ? 'Lỗi khi tải danh mục' : 'Error loading category'
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategory()
  }, [params.id, language])

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      if (!params.id) return
      
      setIsLoadingProducts(true)
      try {
        logger.info('Loading products for category', { 
          categoryId: params.id, 
          page: currentPage, 
          sortBy, 
          priceRange,
          searchQuery 
        })
        
        const { products: productData, total } = await fetchProductsByCategory(
          params.id as string,
          {
            page: currentPage,
            limit: 12,
            sortBy: sortBy === 'featured' ? 'createdAt' : sortBy,
            sortOrder: sortBy === 'price-low' ? 'asc' : 'desc',
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            search: searchQuery || undefined,
          }
        )
        
        if (productData && productData.length > 0) {
          setProducts(productData)
          setTotalProducts(total)
          logger.info('Products loaded successfully', { count: productData.length, total })
        } else {
          // Fallback to mock data if no products found
          const fallbackProducts = getFallbackProducts(language)
          setProducts(fallbackProducts)
          setTotalProducts(fallbackProducts.length)
          logger.warn('No products found, using fallback data', { categoryId: params.id })
        }
      } catch (error) {
        logger.error('Error loading products, using fallback data', { error, categoryId: params.id })
        // Fallback to mock data on error
        const fallbackProducts = getFallbackProducts(language)
        setProducts(fallbackProducts)
        setTotalProducts(fallbackProducts.length)
      } finally {
        setIsLoadingProducts(false)
      }
    }

    loadProducts()
  }, [params.id, currentPage, sortBy, priceRange, searchQuery, language])

  const sortOptions = [
    { value: "featured", label: language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật" },
    { value: "newest", label: t.sort.newest },
    { value: "price-low", label: t.sort.price_low },
    { value: "price-high", label: t.sort.price_high },
    { value: "rating", label: t.sort.rating },
    { value: "popular", label: t.sort.popular },
  ]

  // Filter products (client-side filtering for additional filters not handled by API)
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Format filter (if we have format data)
      if (selectedFormats.length > 0 && product.format) {
        if (!selectedFormats.includes(product.format)) return false
      }

      // Rating filter
      if (product.rating && product.rating < minRating) return false

      // Feature filters (if we have these properties)
      if (hasTextures && product.specifications && !product.specifications.hasTextures) return false
      if (isRigged && product.specifications && !product.specifications.isRigged) return false
      if (isAnimated && product.specifications && !product.specifications.isAnimated) return false
      if (isAnimated && !product.animated) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case "featured":
        filtered = filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return (b.rating || 0) - (a.rating || 0)
        })
        break
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
        filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "popular":
        filtered = filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        break
    }

    return filtered
  }, [
    priceRange,
    selectedFormats,
    minRating,
    hasTextures,
    isRigged,
    isAnimated,
    sortBy,
    products,
  ])

  const clearFilters = () => {
    setPriceRange([0, 1000000])
    setSelectedFormats([])
    setMinRating(0)
    setHasTextures(false)
    setIsRigged(false)
    setIsAnimated(false)
  }

  const activeFiltersCount =
    selectedFormats.length +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (hasTextures ? 1 : 0) +
    (isRigged ? 1 : 0) +
    (isAnimated ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Note: Subcategories filter removed as API doesn't currently support subcategories */}

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{language === "en" ? "Loading category..." : language === "zh" ? "加载分类中..." : "Đang tải danh mục..."}</span>
        </div>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0e1a13] mb-2">
            {language === "en" ? "Category not found" : language === "zh" ? "未找到分类" : "Không tìm thấy danh mục"}
          </h1>
          <p className="text-[#51946b] mb-4">{error || "Category does not exist"}</p>
          <Button asChild>
            <Link href="/categories">
              {language === "en" ? "Back to Categories" : language === "zh" ? "返回分类" : "Quay lại Danh mục"}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-[#51946b]">
          <Link href="/" className="hover:text-[#39e079]">
            {t.header.home}
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#39e079]">
            {language === "en" ? "Categories" : language === "zh" ? "分类" : "Danh mục"}
          </Link>
          <span>/</span>
          <span className="text-[#0e1a13]">{getCategoryDisplayName(category, language)}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/categories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "en" ? "Back to Categories" : language === "zh" ? "返回分类" : "Quay lại Danh mục"}
          </Link>
        </Button>

        {/* Category Header */}
        <div className="mb-8">
          <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-xl mb-6">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={getCategoryDisplayName(category, language)}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{getCategoryDisplayName(category, language)}</h1>
                <p className="text-lg opacity-90">
                  {totalProducts}{" "}
                  {language === "en" ? "models available" : language === "zh" ? "个可用模型" : "mô hình có sẵn"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[#51946b] text-lg max-w-4xl">{getCategoryDescription(category, language)}</p>
        </div>

        {/* Note: Subcategories section removed as API doesn't currently support subcategories */}

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

                {/* Results Count */}
                <span className="text-sm text-[#51946b]">
                  {filteredProducts.length}{" "}
                  {language === "en" ? "products found" : language === "zh" ? "个产品" : "sản phẩm"}
                </span>

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

            {/* Products Grid/List */}
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{language === "en" ? "Loading products..." : language === "zh" ? "加载产品中..." : "Đang tải sản phẩm..."}</span>
                </div>
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
                            src={product.imageUrl || product.images?.[0] || "/placeholder.svg"}
                            alt={getProductDisplayName(product, language)}
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
                            {getProductDisplayName(product, language)}
                          </h3>
                        </Link>

                        <p className="text-sm text-[#51946b] mb-2 line-clamp-2">{getProductDescription(product, language)}</p>

                        <div className="flex items-center gap-2 mb-2">
                          {product.rating && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-[#51946b] ml-1">
                                {product.rating} ({product.downloads || product.reviewCount || product.reviews || 0})
                              </span>
                            </div>
                          )}
                          {product.format && (
                            <Badge variant="outline" className="text-xs">
                              {product.format}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-[#0e1a13]">{formatCurrency(Number(product.price), language)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-[#51946b] line-through">
                              {formatCurrency(Number(product.originalPrice), language)}
                            </span>
                          )}
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
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">
                  {language === "en"
                    ? "No products found"
                    : language === "zh"
                      ? "未找到产品"
                      : "Không tìm thấy sản phẩm"}
                </h3>
                <p className="text-[#51946b] mb-4">
                  {language === "en"
                    ? "Try adjusting your filters to see more results"
                    : language === "zh"
                      ? "尝试调整筛选条件以查看更多结果"
                      : "Thử điều chỉnh bộ lọc để xem thêm kết quả"}
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
