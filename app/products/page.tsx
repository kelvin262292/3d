"use client"

import { useState, useMemo } from "react"
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

// Mock data for products
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
        ? ["villa", "modern", "architecture"]
        : language === "zh"
          ? ["别墅", "现代", "建筑"]
          : ["villa", "hiện đại", "kiến trúc"],
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
        ? ["ferrari", "sports car", "luxury"]
        : language === "zh"
          ? ["法拉利", "跑车", "豪华"]
          : ["ferrari", "xe thể thao", "luxury"],
    format: "OBJ",
    polygons: 25000,
    textures: true,
    rigged: true,
    animated: true,
    featured: true,
  },
  // Add more products...
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
        ? ["anime", "girl", "character"]
        : language === "zh"
          ? ["动漫", "女孩", "角色"]
          : ["anime", "girl", "nhân vật"],
    format: "FBX",
    polygons: 8000,
    textures: true,
    rigged: true,
    animated: true,
    featured: false,
  },
  {
    id: "4",
    name: language === "en" ? "Office Building" : language === "zh" ? "办公楼" : "Tòa Nhà Văn Phòng",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Commercial" : language === "zh" ? "商业" : "Thương mại",
    price: 550000,
    rating: 4.5,
    reviews: 43,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["office", "building", "commercial"]
        : language === "zh"
          ? ["办公室", "建筑", "商业"]
          : ["văn phòng", "tòa nhà", "thương mại"],
    format: "MAX",
    polygons: 45000,
    textures: true,
    rigged: false,
    animated: false,
    featured: false,
  },
  {
    id: "5",
    name: language === "en" ? "Fighter Jet" : language === "zh" ? "战斗机" : "Máy Bay Chiến Đấu",
    category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    subcategory: language === "en" ? "Aircraft" : language === "zh" ? "飞机" : "Máy bay",
    price: 399000,
    rating: 4.8,
    reviews: 91,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["fighter", "jet", "military"]
        : language === "zh"
          ? ["战斗机", "喷气式", "军事"]
          : ["máy bay", "chiến đấu", "quân sự"],
    format: "FBX",
    polygons: 28000,
    textures: true,
    rigged: false,
    animated: false,
    featured: true,
  },
  {
    id: "6",
    name: language === "en" ? "Medieval Sword" : language === "zh" ? "中世纪剑" : "Kiếm Trung Cổ",
    category: language === "en" ? "Weapons" : language === "zh" ? "武器" : "Vũ khí",
    subcategory: language === "en" ? "Melee" : language === "zh" ? "近战" : "Cận chiến",
    price: 89000,
    rating: 4.6,
    reviews: 178,
    image: "/placeholder.svg?height=300&width=300",
    tags:
      language === "en"
        ? ["sword", "medieval", "weapon"]
        : language === "zh"
          ? ["剑", "中世纪", "武器"]
          : ["kiếm", "trung cổ", "vũ khí"],
    format: "BLEND",
    polygons: 5000,
    textures: true,
    rigged: false,
    animated: false,
    featured: false,
  },
]

const getCategories = (language: string) => [
  {
    id: "architecture",
    name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    count: 156,
  },
  { id: "vehicles", name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ", count: 89 },
  { id: "characters", name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật", count: 234 },
  { id: "creatures", name: language === "en" ? "Creatures" : language === "zh" ? "生物" : "Sinh vật", count: 67 },
  { id: "furniture", name: language === "en" ? "Furniture" : language === "zh" ? "家具" : "Nội thất", count: 123 },
  { id: "weapons", name: language === "en" ? "Weapons" : language === "zh" ? "武器" : "Vũ khí", count: 45 },
]

const formats = ["FBX", "OBJ", "BLEND", "MAX", "3DS", "DAE"]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { language, t } = useLanguage()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [hasTextures, setHasTextures] = useState(false)
  const [isRigged, setIsRigged] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [sortBy, setSortBy] = useState("featured")

  const mockProducts = getMockProducts(language)
  const categories = getCategories(language)

  const sortOptions = [
    { value: "featured", label: language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật" },
    { value: "newest", label: t.sort.newest },
    { value: "price-low", label: t.sort.price_low },
    { value: "price-high", label: t.sort.price_high },
    { value: "rating", label: t.sort.rating },
    { value: "popular", label: t.sort.popular },
  ]

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category)) return false
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false

      // Format filter
      if (selectedFormats.length > 0) {
        if (!selectedFormats.includes(product.format)) return false
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
      case "featured":
        filtered = filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
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
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popular":
        filtered = filtered.sort((a, b) => b.reviews - a.reviews)
        break
    }

    return filtered
  }, [
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
            {filteredProducts.length > 0 ? (
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
                            src={product.image || "/placeholder.svg"}
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
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-[#0e1a13] mb-2 hover:text-[#39e079] transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-sm text-[#51946b] mb-2">{product.category}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-[#51946b] ml-1">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {product.format}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-[#0e1a13]">{formatCurrency(product.price, language)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-[#51946b] line-through">
                              {formatCurrency(product.originalPrice, language)}
                            </span>
                          )}
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
          </div>
        </div>
      </div>
    </div>
  )
}
