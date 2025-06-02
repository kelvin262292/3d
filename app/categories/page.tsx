"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Grid, List, Search, TrendingUp, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"
import { Category } from "@/types/api"

// API function to fetch categories
async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories')
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

// Helper function to get category display name based on language
function getCategoryDisplayName(category: Category, language: string): string {
  // For now, return the category name as is
  // In the future, you can add localization logic here
  return category.name
}

// Helper function to get category description based on language
function getCategoryDescription(category: Category, language: string): string {
  // For now, return the category description as is
  // In the future, you can add localization logic here
  return category.description || ''
}

// Helper function to get featured categories (top categories by product count)
function getFeaturedCategories(categories: Category[], language: string): Category[] {
  return categories
    .filter(category => category._count.products > 20) // Only categories with more than 20 products
    .sort((a, b) => b._count.products - a._count.products) // Sort by product count descending
    .slice(0, 3) // Take top 3
}


export default function CategoriesPage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const featuredCategories = getFeaturedCategories(categories, language)

  const sortOptions = [
    {
      value: "popular",
      label: language === "en" ? "Most Popular" : language === "zh" ? "最受欢迎" : "Phổ biến nhất",
    },
    {
      value: "name",
      label: language === "en" ? "Name A-Z" : language === "zh" ? "名称 A-Z" : "Tên A-Z",
    },
    {
      value: "count",
      label: language === "en" ? "Most Models" : language === "zh" ? "模型最多" : "Nhiều mô hình nhất",
    },
    {
      value: "newest",
      label: language === "en" ? "Newest" : language === "zh" ? "最新" : "Mới nhất",
    },
  ]

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    getCategoryDisplayName(category, language).toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return getCategoryDisplayName(a, language).localeCompare(getCategoryDisplayName(b, language))
      case "count":
        return b._count.products - a._count.products
      case "trending":
        // For now, sort by product count as trending indicator
        return b._count.products - a._count.products
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0e1a13] mb-2">
            {language === "en" ? "Browse Categories" : language === "zh" ? "浏览分类" : "Duyệt Danh Mục"}
          </h1>
          <p className="text-[#51946b]">
            {language === "en"
              ? "Explore our diverse collection of 3D models organized by category"
              : language === "zh"
                ? "探索我们按分类整理的多样化3D模型收藏"
                : "Khám phá bộ sưu tập đa dạng các mô hình 3D được sắp xếp theo danh mục"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#39e079]" />
            <span className="ml-2 text-[#51946b]">
              {language === "en" ? "Loading categories..." : language === "zh" ? "加载分类中..." : "Đang tải danh mục..."}
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">
              {language === "en" ? "Error Loading Categories" : language === "zh" ? "加载分类出错" : "Lỗi tải danh mục"}
            </h3>
            <p className="text-[#51946b] mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
            >
              {language === "en" ? "Retry" : language === "zh" ? "重试" : "Thử lại"}
            </Button>
          </div>
        )}

        {/* Featured Categories */}
        {!loading && !error && featuredCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0e1a13] mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-[#39e079]" />
              {language === "en" ? "Featured Collections" : language === "zh" ? "精选收藏" : "Bộ sưu tập nổi bật"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug || category.id}`}>
                  <Card className="border-[#d1e6d9] hover:shadow-lg transition-all group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <div className="relative w-full h-32 overflow-hidden rounded-lg">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={getCategoryDisplayName(category, language)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-[#39e079] text-[#0e1a13]">
                          {language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[#0e1a13] mb-2 group-hover:text-[#39e079] transition-colors">
                        {getCategoryDisplayName(category, language)}
                      </h3>
                      <p className="text-sm text-[#51946b] mb-3">{getCategoryDescription(category, language)}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                          {category._count.products} {language === "en" ? "models" : language === "zh" ? "个模型" : "mô hình"}
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-[#39e079] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter Bar */}
        {!loading && !error && (
          <div className="mb-8">
            <Card className="border-[#d1e6d9]">
              <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
                  <Input
                    placeholder={
                      language === "en"
                        ? "Search categories..."
                        : language === "zh"
                          ? "搜索分类..."
                          : "Tìm kiếm danh mục..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#d1e6d9] focus:border-[#39e079]"
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-4">
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
              </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories Grid/List */}
        {!loading && !error && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0e1a13]">
                {language === "en" ? "All Categories" : language === "zh" ? "所有分类" : "Tất cả Danh mục"}
              </h2>
              <span className="text-[#51946b]">
                {sortedCategories.length} {language === "en" ? "categories" : language === "zh" ? "个分类" : "danh mục"}
              </span>
            </div>

          {sortedCategories.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {sortedCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug || category.id}`}>
                  <Card className="border-[#d1e6d9] hover:shadow-lg transition-all group cursor-pointer h-full">
                    <CardContent className={viewMode === "grid" ? "p-6" : "p-4 flex gap-4"}>
                      <div className={viewMode === "grid" ? "" : "w-24 flex-shrink-0"}>
                        <div className="relative w-full h-32 mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={getCategoryDisplayName(category, language)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          {category._count.products > 50 && (
                            <Badge className="absolute top-2 right-2 bg-[#39e079] text-[#0e1a13]">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {language === "en" ? "Popular" : language === "zh" ? "热门" : "Phổ biến"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0e1a13] mb-2 group-hover:text-[#39e079] transition-colors">
                          {getCategoryDisplayName(category, language)}
                        </h3>
                        <p className="text-sm text-[#51946b] mb-4 line-clamp-2">{getCategoryDescription(category, language)}</p>

                        <div className="space-y-3">
                          {/* Model Count */}
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                              {category._count.products} {language === "en" ? "models" : language === "zh" ? "个模型" : "mô hình"}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-[#39e079] group-hover:translate-x-1 transition-transform" />
                          </div>

                          {/* Category Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs border-[#d1e6d9] text-[#51946b]">
                                {language === "en" ? "Category" : language === "zh" ? "分类" : "Danh mục"}: {category.slug}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">
                {language === "en"
                  ? "No categories found"
                  : language === "zh"
                    ? "未找到分类"
                    : "Không tìm thấy danh mục nào"}
              </h3>
              <p className="text-[#51946b] mb-4">
                {language === "en"
                  ? "Try adjusting your search terms"
                  : language === "zh"
                    ? "尝试调整搜索词"
                    : "Thử điều chỉnh từ khóa tìm kiếm"}
              </p>
              <Button onClick={() => setSearchQuery("")} className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                {language === "en" ? "Clear Search" : language === "zh" ? "清除搜索" : "Xóa tìm kiếm"}
              </Button>
            </div>
          )}
          </section>
        )}

        {/* Popular Tags */}
        {!loading && !error && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-[#0e1a13] mb-6">
              {language === "en" ? "Popular Tags" : language === "zh" ? "热门标签" : "Thẻ phổ biến"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                language === "en" ? "Modern" : language === "zh" ? "现代" : "Hiện đại",
                language === "en" ? "Realistic" : language === "zh" ? "写实" : "Thực tế",
                language === "en" ? "Low Poly" : language === "zh" ? "低多边形" : "Low Poly",
                language === "en" ? "Textured" : language === "zh" ? "有纹理" : "Có texture",
                language === "en" ? "Rigged" : language === "zh" ? "绑定" : "Rigging",
                language === "en" ? "Animated" : language === "zh" ? "动画" : "Animation",
                language === "en" ? "Game Ready" : language === "zh" ? "游戏就绪" : "Game Ready",
                language === "en" ? "PBR" : language === "zh" ? "PBR" : "PBR",
              ].map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[#e8f2ec] text-[#51946b] hover:bg-[#39e079] hover:text-[#0e1a13] cursor-pointer transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
