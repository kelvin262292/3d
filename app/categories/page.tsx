"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Grid, List, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"

// Mock data cho categories
const getCategories = (language: string) => [
  {
    id: "architecture",
    name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    description:
      language === "en"
        ? "Buildings, structures, and architectural elements"
        : language === "zh"
          ? "建筑物、结构和建筑元素"
          : "Tòa nhà, công trình và các yếu tố kiến trúc",
    count: 156,
    image: "/placeholder.svg?height=300&width=300",
    trending: true,
    subcategories: [
      {
        id: "residential",
        name: language === "en" ? "Residential" : language === "zh" ? "住宅" : "Nhà ở",
        count: 89,
      },
      {
        id: "commercial",
        name: language === "en" ? "Commercial" : language === "zh" ? "商业" : "Thương mại",
        count: 45,
      },
      {
        id: "industrial",
        name: language === "en" ? "Industrial" : language === "zh" ? "工业" : "Công nghiệp",
        count: 22,
      },
    ],
  },
  {
    id: "vehicles",
    name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    description:
      language === "en"
        ? "Cars, trucks, planes, boats and all transportation"
        : language === "zh"
          ? "汽车、卡车、飞机、船只和所有交通工具"
          : "Ô tô, xe tải, máy bay, thuyền và tất cả phương tiện giao thông",
    count: 89,
    image: "/placeholder.svg?height=300&width=300",
    trending: true,
    subcategories: [
      {
        id: "cars",
        name: language === "en" ? "Cars" : language === "zh" ? "汽车" : "Ô tô",
        count: 45,
      },
      {
        id: "aircraft",
        name: language === "en" ? "Aircraft" : language === "zh" ? "飞机" : "Máy bay",
        count: 23,
      },
      {
        id: "boats",
        name: language === "en" ? "Boats" : language === "zh" ? "船只" : "Thuyền",
        count: 21,
      },
    ],
  },
  {
    id: "characters",
    name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
    description:
      language === "en"
        ? "Human characters, anime, cartoon and fantasy figures"
        : language === "zh"
          ? "人物角色、动漫、卡通和奇幻人物"
          : "Nhân vật con người, anime, hoạt hình và nhân vật fantasy",
    count: 234,
    image: "/placeholder.svg?height=300&width=300",
    trending: true,
    subcategories: [
      {
        id: "anime",
        name: language === "en" ? "Anime" : language === "zh" ? "动漫" : "Anime",
        count: 98,
      },
      {
        id: "realistic",
        name: language === "en" ? "Realistic" : language === "zh" ? "写实" : "Thực tế",
        count: 76,
      },
      {
        id: "cartoon",
        name: language === "en" ? "Cartoon" : language === "zh" ? "卡通" : "Hoạt hình",
        count: 60,
      },
    ],
  },
  {
    id: "creatures",
    name: language === "en" ? "Creatures" : language === "zh" ? "生物" : "Sinh vật",
    description:
      language === "en"
        ? "Animals, monsters, dragons and mythical beings"
        : language === "zh"
          ? "动物、怪物、龙和神话生物"
          : "Động vật, quái vật, rồng và sinh vật thần thoại",
    count: 67,
    image: "/placeholder.svg?height=300&width=300",
    trending: false,
    subcategories: [
      {
        id: "animals",
        name: language === "en" ? "Animals" : language === "zh" ? "动物" : "Động vật",
        count: 34,
      },
      {
        id: "fantasy",
        name: language === "en" ? "Fantasy" : language === "zh" ? "奇幻" : "Fantasy",
        count: 23,
      },
      {
        id: "dinosaurs",
        name: language === "en" ? "Dinosaurs" : language === "zh" ? "恐龙" : "Khủng long",
        count: 10,
      },
    ],
  },
  {
    id: "furniture",
    name: language === "en" ? "Furniture" : language === "zh" ? "家具" : "Nội thất",
    description:
      language === "en"
        ? "Home and office furniture, decorative items"
        : language === "zh"
          ? "家庭和办公家具、装饰用品"
          : "Nội thất gia đình và văn phòng, đồ trang trí",
    count: 123,
    image: "/placeholder.svg?height=300&width=300",
    trending: false,
    subcategories: [
      {
        id: "home",
        name: language === "en" ? "Home" : language === "zh" ? "家庭" : "Gia đình",
        count: 78,
      },
      {
        id: "office",
        name: language === "en" ? "Office" : language === "zh" ? "办公" : "Văn phòng",
        count: 45,
      },
    ],
  },
  {
    id: "weapons",
    name: language === "en" ? "Weapons" : language === "zh" ? "武器" : "Vũ khí",
    description:
      language === "en"
        ? "Swords, guns, medieval and futuristic weapons"
        : language === "zh"
          ? "剑、枪、中世纪和未来武器"
          : "Kiếm, súng, vũ khí trung cổ và tương lai",
    count: 45,
    image: "/placeholder.svg?height=300&width=300",
    trending: false,
    subcategories: [
      {
        id: "melee",
        name: language === "en" ? "Melee" : language === "zh" ? "近战" : "Cận chiến",
        count: 28,
      },
      {
        id: "firearms",
        name: language === "en" ? "Firearms" : language === "zh" ? "火器" : "Súng",
        count: 17,
      },
    ],
  },
  {
    id: "nature",
    name: language === "en" ? "Nature" : language === "zh" ? "自然" : "Thiên nhiên",
    description:
      language === "en"
        ? "Trees, plants, rocks, landscapes and natural elements"
        : language === "zh"
          ? "树木、植物、岩石、景观和自然元素"
          : "Cây cối, thực vật, đá, cảnh quan và các yếu tố tự nhiên",
    count: 78,
    image: "/placeholder.svg?height=300&width=300",
    trending: false,
    subcategories: [
      {
        id: "trees",
        name: language === "en" ? "Trees" : language === "zh" ? "树木" : "Cây cối",
        count: 45,
      },
      {
        id: "rocks",
        name: language === "en" ? "Rocks" : language === "zh" ? "岩石" : "Đá",
        count: 33,
      },
    ],
  },
  {
    id: "electronics",
    name: language === "en" ? "Electronics" : language === "zh" ? "电子产品" : "Điện tử",
    description:
      language === "en"
        ? "Phones, computers, gadgets and electronic devices"
        : language === "zh"
          ? "手机、电脑、小工具和电子设备"
          : "Điện thoại, máy tính, thiết bị và đồ điện tử",
    count: 56,
    image: "/placeholder.svg?height=300&width=300",
    trending: true,
    subcategories: [
      {
        id: "phones",
        name: language === "en" ? "Phones" : language === "zh" ? "手机" : "Điện thoại",
        count: 23,
      },
      {
        id: "computers",
        name: language === "en" ? "Computers" : language === "zh" ? "电脑" : "Máy tính",
        count: 33,
      },
    ],
  },
]

const getFeaturedCategories = (language: string) => [
  {
    id: "new-releases",
    name: language === "en" ? "New Releases" : language === "zh" ? "新发布" : "Mới phát hành",
    description:
      language === "en"
        ? "Latest 3D models added this week"
        : language === "zh"
          ? "本周新增的最新3D模型"
          : "Mô hình 3D mới nhất được thêm tuần này",
    count: 24,
    image: "/placeholder.svg?height=200&width=200",
    badge: language === "en" ? "New" : language === "zh" ? "新" : "Mới",
    badgeColor: "bg-green-500",
  },
  {
    id: "trending",
    name: language === "en" ? "Trending Now" : language === "zh" ? "热门趋势" : "Xu hướng",
    description:
      language === "en"
        ? "Most popular models this month"
        : language === "zh"
          ? "本月最受欢迎的模型"
          : "Mô hình phổ biến nhất tháng này",
    count: 45,
    image: "/placeholder.svg?height=200&width=200",
    badge: language === "en" ? "Hot" : language === "zh" ? "热门" : "Hot",
    badgeColor: "bg-red-500",
  },
  {
    id: "free",
    name: language === "en" ? "Free Models" : language === "zh" ? "免费模型" : "Mô hình miễn phí",
    description:
      language === "en"
        ? "High-quality free 3D models"
        : language === "zh"
          ? "高质量免费3D模型"
          : "Mô hình 3D miễn phí chất lượng cao",
    count: 89,
    image: "/placeholder.svg?height=200&width=200",
    badge: language === "en" ? "Free" : language === "zh" ? "免费" : "Miễn phí",
    badgeColor: "bg-blue-500",
  },
]

export default function CategoriesPage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")

  const categories = getCategories(language)
  const featuredCategories = getFeaturedCategories(language)

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
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "count":
        return b.count - a.count
      case "newest":
        return b.id.localeCompare(a.id)
      case "popular":
      default:
        return b.trending ? 1 : -1
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

        {/* Featured Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#0e1a13] mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-[#39e079]" />
            {language === "en" ? "Featured Collections" : language === "zh" ? "精选收藏" : "Bộ sưu tập nổi bật"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="border-[#d1e6d9] hover:shadow-lg transition-all group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="relative w-full h-32 overflow-hidden rounded-lg">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <Badge className={`absolute top-2 right-2 ${category.badgeColor} text-white`}>
                        {category.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-[#0e1a13] mb-2 group-hover:text-[#39e079] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[#51946b] mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                        {category.count} {language === "en" ? "models" : language === "zh" ? "个模型" : "mô hình"}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-[#39e079] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Search and Filter Bar */}
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

        {/* Categories Grid/List */}
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
                <Link key={category.id} href={`/categories/${category.id}`}>
                  <Card className="border-[#d1e6d9] hover:shadow-lg transition-all group cursor-pointer h-full">
                    <CardContent className={viewMode === "grid" ? "p-6" : "p-4 flex gap-4"}>
                      <div className={viewMode === "grid" ? "" : "w-24 flex-shrink-0"}>
                        <div className="relative w-full h-32 mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          {category.trending && (
                            <Badge className="absolute top-2 right-2 bg-[#39e079] text-[#0e1a13]">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {language === "en" ? "Trending" : language === "zh" ? "热门" : "Xu hướng"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0e1a13] mb-2 group-hover:text-[#39e079] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-[#51946b] mb-4 line-clamp-2">{category.description}</p>

                        <div className="space-y-3">
                          {/* Model Count */}
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                              {category.count} {language === "en" ? "models" : language === "zh" ? "个模型" : "mô hình"}
                            </Badge>
                            <ArrowRight className="w-4 h-4 text-[#39e079] group-hover:translate-x-1 transition-transform" />
                          </div>

                          {/* Subcategories */}
                          {category.subcategories && category.subcategories.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-[#51946b] uppercase tracking-wide">
                                {language === "en" ? "Subcategories" : language === "zh" ? "子分类" : "Danh mục con"}
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {category.subcategories.slice(0, 3).map((sub) => (
                                  <Badge
                                    key={sub.id}
                                    variant="outline"
                                    className="text-xs border-[#d1e6d9] text-[#51946b] hover:border-[#39e079] hover:text-[#39e079] transition-colors"
                                  >
                                    {sub.name} ({sub.count})
                                  </Badge>
                                ))}
                                {category.subcategories.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-[#d1e6d9] text-[#51946b]">
                                    +{category.subcategories.length - 3}{" "}
                                    {language === "en" ? "more" : language === "zh" ? "更多" : "khác"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
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

        {/* Popular Tags */}
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
      </div>
    </div>
  )
}
