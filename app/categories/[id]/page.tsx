"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Grid, List, SlidersHorizontal, Star } from "lucide-react"
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

// Mock data cho category details
const getCategoryData = (id: string, language: string) => {
  const categoryMap: Record<string, any> = {
    architecture: {
      id: "architecture",
      name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      description:
        language === "en"
          ? "Explore our comprehensive collection of architectural 3D models including residential buildings, commercial structures, and urban planning elements. Perfect for architects, game developers, and visualization professionals."
          : language === "zh"
            ? "探索我们全面的建筑3D模型收藏，包括住宅建筑、商业结构和城市规划元素。非常适合建筑师、游戏开发者和可视化专业人士。"
            : "Khám phá bộ sưu tập toàn diện các mô hình 3D kiến trúc bao gồm các tòa nhà dân cư, cấu trúc thương mại và các yếu tố quy hoạch đô thị. Hoàn hảo cho kiến trúc sư, nhà phát triển game và chuyên gia trực quan hóa.",
      image: "/placeholder.svg?height=400&width=800",
      totalModels: 156,
      subcategories: [
        {
          id: "residential",
          name: language === "en" ? "Residential" : language === "zh" ? "住宅" : "Nhà ở",
          count: 89,
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "commercial",
          name: language === "en" ? "Commercial" : language === "zh" ? "商业" : "Thương mại",
          count: 45,
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "industrial",
          name: language === "en" ? "Industrial" : language === "zh" ? "工业" : "Công nghiệp",
          count: 22,
          image: "/placeholder.svg?height=200&width=200",
        },
      ],
    },
    vehicles: {
      id: "vehicles",
      name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      description:
        language === "en"
          ? "Discover our extensive vehicle collection featuring cars, trucks, aircraft, boats, and futuristic transportation. High-quality models perfect for games, films, and automotive visualization."
          : language === "zh"
            ? "发现我们广泛的车辆收藏，包括汽车、卡车、飞机、船只和未来交通工具。高质量模型，非常适合游戏、电影和汽车可视化。"
            : "Khám phá bộ sưu tập xe cộ rộng lớn của chúng tôi bao gồm ô tô, xe tải, máy bay, thuyền và phương tiện giao thông tương lai. Mô hình chất lượng cao hoàn hảo cho game, phim và trực quan hóa ô tô.",
      image: "/placeholder.svg?height=400&width=800",
      totalModels: 89,
      subcategories: [
        {
          id: "cars",
          name: language === "en" ? "Cars" : language === "zh" ? "汽车" : "Ô tô",
          count: 45,
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "aircraft",
          name: language === "en" ? "Aircraft" : language === "zh" ? "飞机" : "Máy bay",
          count: 23,
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "boats",
          name: language === "en" ? "Boats" : language === "zh" ? "船只" : "Thuyền",
          count: 21,
          image: "/placeholder.svg?height=200&width=200",
        },
      ],
    },
  }

  return (
    categoryMap[id] || {
      id,
      name: language === "en" ? "Category" : language === "zh" ? "分类" : "Danh mục",
      description: language === "en" ? "Category description" : language === "zh" ? "分类描述" : "Mô tả danh mục",
      image: "/placeholder.svg?height=400&width=800",
      totalModels: 0,
      subcategories: [],
    }
  )
}

// Mock products for category
const getCategoryProducts = (categoryId: string, language: string) => [
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
    name: language === "en" ? "Office Building Complex" : language === "zh" ? "办公楼群" : "Khu Phức Hợp Văn Phòng",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Commercial" : language === "zh" ? "商业" : "Thương mại",
    price: 550000,
    rating: 4.5,
    reviews: 43,
    image: "/placeholder.svg?height=300&width=300",
    format: "MAX",
    polygons: 45000,
    textures: true,
    rigged: false,
    animated: false,
    featured: false,
  },
  {
    id: "3",
    name: language === "en" ? "Luxury Apartment" : language === "zh" ? "豪华公寓" : "Căn Hộ Sang Trọng",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Residential" : language === "zh" ? "住宅" : "Nhà ở",
    price: 380000,
    rating: 4.7,
    reviews: 78,
    image: "/placeholder.svg?height=300&width=300",
    format: "BLEND",
    polygons: 28000,
    textures: true,
    rigged: false,
    animated: false,
    featured: true,
  },
  {
    id: "4",
    name: language === "en" ? "Industrial Warehouse" : language === "zh" ? "工业仓库" : "Kho Công Nghiệp",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Industrial" : language === "zh" ? "工业" : "Công nghiệp",
    price: 220000,
    rating: 4.3,
    reviews: 32,
    image: "/placeholder.svg?height=300&width=300",
    format: "OBJ",
    polygons: 18000,
    textures: true,
    rigged: false,
    animated: false,
    featured: false,
  },
  {
    id: "5",
    name: language === "en" ? "Shopping Mall" : language === "zh" ? "购物中心" : "Trung Tâm Mua Sắm",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Commercial" : language === "zh" ? "商业" : "Thương mại",
    price: 650000,
    rating: 4.9,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    format: "FBX",
    polygons: 65000,
    textures: true,
    rigged: false,
    animated: false,
    featured: true,
  },
  {
    id: "6",
    name: language === "en" ? "Cozy House" : language === "zh" ? "温馨小屋" : "Ngôi Nhà Ấm Cúng",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    subcategory: language === "en" ? "Residential" : language === "zh" ? "住宅" : "Nhà ở",
    price: 180000,
    rating: 4.6,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    format: "3DS",
    polygons: 12000,
    textures: true,
    rigged: false,
    animated: false,
    featured: false,
  },
]

const formats = ["FBX", "OBJ", "BLEND", "MAX", "3DS", "DAE"]

export default function CategoryDetailPage() {
  const params = useParams()
  const { language, t } = useLanguage()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [hasTextures, setHasTextures] = useState(false)
  const [isRigged, setIsRigged] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)
  const [sortBy, setSortBy] = useState("featured")

  const categoryData = getCategoryData(params.id as string, language)
  const allProducts = getCategoryProducts(params.id as string, language)

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
    let filtered = allProducts.filter((product) => {
      // Subcategory filter
      if (selectedSubcategories.length > 0) {
        if (!selectedSubcategories.includes(product.subcategory)) return false
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
    selectedSubcategories,
    priceRange,
    selectedFormats,
    minRating,
    hasTextures,
    isRigged,
    isAnimated,
    sortBy,
    allProducts,
  ])

  const clearFilters = () => {
    setSelectedSubcategories([])
    setPriceRange([0, 1000000])
    setSelectedFormats([])
    setMinRating(0)
    setHasTextures(false)
    setIsRigged(false)
    setIsAnimated(false)
  }

  const activeFiltersCount =
    selectedSubcategories.length +
    selectedFormats.length +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (hasTextures ? 1 : 0) +
    (isRigged ? 1 : 0) +
    (isAnimated ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Subcategories */}
      {categoryData.subcategories.length > 0 && (
        <>
          <div>
            <h3 className="font-semibold text-[#0e1a13] mb-3">
              {language === "en" ? "Subcategories" : language === "zh" ? "子分类" : "Danh mục con"}
            </h3>
            <div className="space-y-2">
              {categoryData.subcategories.map((subcategory: any) => (
                <div key={subcategory.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subcategory.id}
                    checked={selectedSubcategories.includes(subcategory.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubcategories([...selectedSubcategories, subcategory.name])
                      } else {
                        setSelectedSubcategories(selectedSubcategories.filter((c) => c !== subcategory.name))
                      }
                    }}
                  />
                  <Label htmlFor={subcategory.id} className="flex-1 text-sm">
                    {subcategory.name}
                  </Label>
                  <span className="text-xs text-[#51946b]">({subcategory.count})</span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

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
          <span className="text-[#0e1a13]">{categoryData.name}</span>
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
              src={categoryData.image || "/placeholder.svg"}
              alt={categoryData.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{categoryData.name}</h1>
                <p className="text-lg opacity-90">
                  {categoryData.totalModels}{" "}
                  {language === "en" ? "models available" : language === "zh" ? "个可用模型" : "mô hình có sẵn"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[#51946b] text-lg max-w-4xl">{categoryData.description}</p>
        </div>

        {/* Subcategories */}
        {categoryData.subcategories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#0e1a13] mb-6">
              {language === "en"
                ? "Browse by Subcategory"
                : language === "zh"
                  ? "按子分类浏览"
                  : "Duyệt theo danh mục con"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.subcategories.map((subcategory: any) => (
                <Link key={subcategory.id} href={`/categories/${categoryData.id}/${subcategory.id}`}>
                  <Card className="border-[#d1e6d9] hover:shadow-lg transition-all group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="relative w-full h-32 mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold text-[#0e1a13] mb-2 group-hover:text-[#39e079] transition-colors">
                        {subcategory.name}
                      </h3>
                      <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                        {subcategory.count} {language === "en" ? "models" : language === "zh" ? "个模型" : "mô hình"}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

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

                        <p className="text-sm text-[#51946b] mb-2">{product.subcategory}</p>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
