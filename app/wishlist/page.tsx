"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Trash2, Share2, Grid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"
import { formatCurrency } from "@/lib/i18n"
import Image from "next/image"
import Link from "next/link"
import { logger } from "@/lib/logger"

// Mock wishlist data
const getWishlistItems = (language: string) => [
  {
    id: "1",
    name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    price: 299000,
    originalPrice: 399000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 124,
    format: "FBX",
    discount: 25,
    featured: true,
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    name: language === "en" ? "Ferrari Sports Car" : language === "zh" ? "法拉利跑车" : "Xe Thể Thao Ferrari",
    category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    price: 450000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 89,
    format: "OBJ",
    featured: false,
    dateAdded: "2024-01-10",
  },
  {
    id: "3",
    name: language === "en" ? "Anime Character Rin" : language === "zh" ? "动漫角色凛" : "Nhân Vật Anime Rin",
    category: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
    price: 199000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 156,
    format: "FBX",
    featured: true,
    dateAdded: "2024-01-08",
  },
  {
    id: "4",
    name: language === "en" ? "Dragon Creature" : language === "zh" ? "龙生物" : "Sinh Vật Rồng",
    category: language === "en" ? "Creatures" : language === "zh" ? "生物" : "Sinh vật",
    price: 350000,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 78,
    format: "BLEND",
    featured: false,
    dateAdded: "2024-01-05",
  },
]

export default function WishlistPage() {
  const { language, t } = useLanguage()
  const [wishlistItems, setWishlistItems] = useState(getWishlistItems(language))
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const removeFromWishlist = (id: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id))
  }

  const addToCart = (id: string) => {
    // Add to cart logic here
    logger.info('Item added to cart from wishlist', 'UI', { productId: id })
  }

  const shareWishlist = () => {
    // Share wishlist logic here
    navigator.clipboard.writeText(window.location.href)
  }

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        case "oldest":
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        case "price_low":
          return a.price - b.price
        case "price_high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const categories = Array.from(new Set(wishlistItems.map((item) => item.category)))

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fbfa]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#e8f2ec] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-[#51946b]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0e1a13] mb-4">{t.cart.empty}</h1>
            <p className="text-[#51946b] mb-8">
              {language === "en"
                ? "Save your favorite 3D models to your wishlist"
                : language === "zh"
                  ? "将您喜欢的3D模型保存到收藏夹"
                  : "Lưu các mô hình 3D yêu thích vào danh sách"}
            </p>
            <Button asChild size="lg" className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
              <Link href="/products">
                {language === "en" ? "Browse Products" : language === "zh" ? "浏览产品" : "Duyệt Sản Phẩm"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0e1a13] mb-2">{t.header.wishlist}</h1>
              <p className="text-[#51946b]">
                {filteredItems.length}{" "}
                {language === "en" ? "saved items" : language === "zh" ? "个收藏项目" : "mục đã lưu"}
              </p>
            </div>
            <Button onClick={shareWishlist} variant="outline" className="border-[#39e079] text-[#39e079]">
              <Share2 className="w-4 h-4 mr-2" />
              {language === "en" ? "Share" : language === "zh" ? "分享" : "Chia sẻ"}
            </Button>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-4 h-4" />
                <Input
                  placeholder={t.search.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#d1e6d9]"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-[#d1e6d9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === "en" ? "All Categories" : language === "zh" ? "所有分类" : "Tất cả danh mục"}
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-[#d1e6d9]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t.sort.newest}</SelectItem>
                  <SelectItem value="oldest">
                    {language === "en" ? "Oldest" : language === "zh" ? "最旧" : "Cũ nhất"}
                  </SelectItem>
                  <SelectItem value="price_low">{t.sort.price_low}</SelectItem>
                  <SelectItem value="price_high">{t.sort.price_high}</SelectItem>
                  <SelectItem value="rating">{t.sort.rating}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#39e079] text-[#0e1a13]" : "border-[#d1e6d9]"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#39e079] text-[#0e1a13]" : "border-[#d1e6d9]"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group border-[#d1e6d9] hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.featured && (
                      <Badge className="absolute top-2 left-2 bg-[#39e079] text-[#0e1a13]">{t.product.featured}</Badge>
                    )}
                    {item.discount && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{item.discount}%</Badge>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => removeFromWishlist(item.id)}
                        className="bg-white/90 hover:bg-white"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-semibold text-[#0e1a13] hover:text-[#39e079] transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-[#51946b]">{item.category}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-[#51946b]">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="font-bold text-[#0e1a13]">{formatCurrency(item.price, language)}</div>
                      {item.originalPrice && (
                        <div className="text-sm text-[#51946b] line-through">
                          {formatCurrency(item.originalPrice, language)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => addToCart(item.id)}
                        className="flex-1 bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t.product.add_to_cart}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.id)}
                        className="border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-[#d1e6d9]">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      {item.discount && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                          -{item.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/products/${item.id}`}>
                            <h3 className="font-semibold text-[#0e1a13] hover:text-[#39e079] transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-[#51946b]">{item.category}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-[#51946b]">
                              {item.rating} ({item.reviews})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#0e1a13]">{formatCurrency(item.price, language)}</div>
                          {item.originalPrice && (
                            <div className="text-sm text-[#51946b] line-through">
                              {formatCurrency(item.originalPrice, language)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[#51946b]">
                          {language === "en" ? "Added" : language === "zh" ? "添加于" : "Đã thêm"}:{" "}
                          {new Date(item.dateAdded).toLocaleDateString(
                            language === "zh" ? "zh-CN" : language === "vi" ? "vi-VN" : "en-US",
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addToCart(item.id)}
                            className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {t.product.add_to_cart}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromWishlist(item.id)}
                            className="border-red-200 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-[#51946b] mb-4">
              {language === "en"
                ? "No items found matching your search"
                : language === "zh"
                  ? "未找到匹配的项目"
                  : "Không tìm thấy mục nào phù hợp"}
            </p>
            <Button onClick={() => setSearchQuery("")} variant="outline" className="border-[#39e079] text-[#39e079]">
              {language === "en" ? "Clear Search" : language === "zh" ? "清除搜索" : "Xóa tìm kiếm"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
