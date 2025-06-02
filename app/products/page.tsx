"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Grid, List, SlidersHorizontal } from "lucide-react"
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
import Image from "next/image"
import Link from "next/link"

import { Product, Category, ProductsResponse } from "@/types/api"

const formats = ["FBX", "OBJ", "BLEND", "MAX", "3DS", "DAE"]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { language, t } = useLanguage()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [hasTextures, setHasTextures] = useState(false)
  const [isRigged, setIsRigged] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })
  const [error, setError] = useState<string | null>(null)
useEffect(() => {
  const controller = new AbortController()
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', { signal: controller.signal })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching categories:', error)
      }
    }
  }
  fetchCategories()
  return () => controller.abort()
}, [])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12'
        })

        if (selectedCategories.length > 0) {
          params.append('category', selectedCategories[0])
        }

        if (sortBy === 'featured') {
          params.append('featured', 'true')
        } else if (sortBy === 'newest') {
          params.append('sort', 'createdAt')
          params.append('order', 'desc')
        } else if (sortBy === 'price-low') {
          params.append('sort', 'price')
          params.append('order', 'asc')
        } else if (sortBy === 'price-high') {
          params.append('sort', 'price')
          params.append('order', 'desc')
        } else if (sortBy === 'rating') {
          params.append('sort', 'rating')
          params.append('order', 'desc')
        } else if (sortBy === 'popular') {
          params.append('sort', 'downloads')
          params.append('order', 'desc')
        }

        // Add search parameter from URL
        const searchQuery = searchParams.get('search')
        if (searchQuery) {
          params.append('search', searchQuery)
        }

        const response = await fetch(`/api/products?${params}`)
        if (response.ok) {
          const data: ProductsResponse = await response.json()
          setProducts(data.products)
          setPagination(data.pagination)
        } else {
          console.error('Failed to fetch products:', response.statusText)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [currentPage, selectedCategories, sortBy, searchParams])

  const sortOptions = [
    { value: "featured", label: language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật" },
    { value: "newest", label: t.sort.newest },
    { value: "price-low", label: t.sort.price_low },
    { value: "price-high", label: t.sort.price_high },
    { value: "rating", label: t.sort.rating },
    { value: "popular", label: t.sort.popular },
  ]

  // Filter products (client-side filtering for additional filters)
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false

      // Rating filter
      if (product.rating < minRating) return false

      return true
    })

    return filtered
  }, [
    products,
    priceRange,
    minRating,
  ])

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
              <span className="text-xs text-[#51946b]">({category._count._all})</span>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0e1a13] mb-2">
            {language === "en" ? "3D Models" : language === "zh" ? "3D模型" : "Mô Hình 3D"}
          </h1>
          <p className="text-[#51946b]">
            {language === "en"
              ? "Discover our complete collection of premium 3D models"
              : language === "zh"
                ? "探索我们完整的优质3D模型收藏"
                : "Khám phá bộ sưu tập đầy đủ các mô hình 3D cao cấp"}
          </p>
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
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="border-[#d1e6d9]">
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                          {product.featured && (
                            <Badge className="absolute top-2 right-2 bg-[#39e079] text-[#0e1a13]">
                              {language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-semibold text-[#0e1a13] mb-2 hover:text-[#39e079] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-sm text-[#51946b] mb-2">{product.category.name}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-[#51946b] ml-1">
                              {product.rating} ({product.downloads})
                            </span>
                          </div>
                          {product.tags && product.tags.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {product.tags[0]}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-[#0e1a13]">{formatCurrency(product.price, language)}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-[#e8f2ec] text-[#51946b]">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                            {t.product.add_to_cart}
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
                  {t.filters.clear_filters}
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > 0 && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-[#d1e6d9]"
                >
                  {language === "en" ? "Previous" : language === "zh" ? "上一页" : "Trước"}
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
                            : "border-[#d1e6d9]"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="border-[#d1e6d9]"
                >
                  {language === "en" ? "Next" : language === "zh" ? "下一页" : "Tiếp"}
                </Button>
              </div>
            )}

            {/* Results info */}
            {!loading && (
              <div className="text-center text-sm text-[#51946b] mt-4">
                {language === "en"
                  ? `Showing ${filteredProducts.length} of ${pagination.total} products`
                  : language === "zh"
                    ? `显示 ${filteredProducts.length} / ${pagination.total} 个产品`
                    : `Hiển thị ${filteredProducts.length} / ${pagination.total} sản phẩm`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
