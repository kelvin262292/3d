"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Zap, Shield, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import { formatCurrency } from "@/lib/i18n"
import { SearchAutocomplete } from "@/components/search-autocomplete"
import { useRouter } from "next/navigation"
import { logger } from "@/lib/logger"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Types for API response
interface Product {
  id: string
  name: string
  description?: string
  price: number
  slug: string
  images: string[]
  imageUrl?: string
  rating: number
  downloads: number
  featured: boolean
  category: {
    name: string
    slug: string
  }
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Mock data for homepage
const getFeaturedProducts = (language: string) => [
  {
    id: "1",
    name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
    category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    price: 299000,
    originalPrice: 399000,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
    discount: 25,
  },
  {
    id: "2",
    name: language === "en" ? "Ferrari Sports Car" : language === "zh" ? "法拉利跑车" : "Xe Thể Thao Ferrari",
    category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    price: 450000,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "3",
    name: language === "en" ? "Anime Girl Character" : language === "zh" ? "动漫女孩角色" : "Nhân Vật Anime Girl",
    category: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
    price: 199000,
    rating: 4.7,
    reviews: 256,
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "4",
    name: language === "en" ? "Mythical Dragon" : language === "zh" ? "神话龙" : "Rồng Thần Thoại",
    category: language === "en" ? "Creatures" : language === "zh" ? "生物" : "Sinh vật",
    price: 350000,
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
]

const getCategories = (language: string) => [
  {
    id: "architecture",
    name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
    count: 156,
    image: "/placeholder.svg?height=200&width=200",
    description:
      language === "en" ? "Buildings & Structures" : language === "zh" ? "建筑与结构" : "Tòa nhà & Công trình",
  },
  {
    id: "vehicles",
    name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
    count: 89,
    image: "/placeholder.svg?height=200&width=200",
    description:
      language === "en" ? "Cars, Planes & More" : language === "zh" ? "汽车、飞机等" : "Ô tô, Máy bay & Khác",
  },
  {
    id: "characters",
    name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
    count: 234,
    image: "/placeholder.svg?height=200&width=200",
    description: language === "en" ? "People & Creatures" : language === "zh" ? "人物与生物" : "Con người & Sinh vật",
  },
  {
    id: "furniture",
    name: language === "en" ? "Furniture" : language === "zh" ? "家具" : "Nội thất",
    count: 123,
    image: "/placeholder.svg?height=200&width=200",
    description: language === "en" ? "Home & Office" : language === "zh" ? "家庭与办公" : "Gia đình & Văn phòng",
  },
]

// Hero slides data
const heroSlides = [
  {
    id: 1,
    image: "/hero-1.jpg",
    title: "Premium 3D Models",
    subtitle: "For Creators"
  },
  {
    id: 2, 
    image: "/hero-2.jpg",
    title: "High Quality Assets",
    subtitle: "Ready to Use"
  },
  {
    id: 3,
    image: "/hero-3.jpg", 
    title: "Professional Tools",
    subtitle: "For Your Projects"
  }
]

export default function HomePage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch featured products from API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products?featured=true&limit=4')
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }
        const data: ProductsResponse = await response.json()
        setFeaturedProducts(data.products)
        logger.info('Featured products loaded successfully', 'UI', { count: data.products.length })
      } catch (error) {
        logger.error('Failed to fetch featured products', 'UI', { error })
        setError('Failed to load featured products')
        // Fallback to empty array
        setFeaturedProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.categories || [])
        logger.info('Categories loaded successfully', 'UI', { count: data.categories?.length || 0 })
      } catch (error) {
        logger.error('Failed to fetch categories', 'UI', { error })
        // Fallback to mock categories
        setCategories(getCategories(language))
      }
    }

    fetchFeaturedProducts()
    fetchCategories()
  }, [language])

  // Keep mock categories as fallback
  const mockCategories = getCategories(language)

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: language === "en" ? "High Quality" : language === "zh" ? "高品质" : "Chất lượng cao",
      description:
        language === "en"
          ? "Premium 3D models with detailed textures"
          : language === "zh"
            ? "优质3D模型，纹理细致"
            : "Mô hình 3D cao cấp với texture chi tiết",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: language === "en" ? "Secure Payment" : language === "zh" ? "安全支付" : "Thanh toán an toàn",
      description:
        language === "en"
          ? "Safe and secure payment processing"
          : language === "zh"
            ? "安全可靠的支付处理"
            : "Xử lý thanh toán an toàn và bảo mật",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: language === "en" ? "24/7 Support" : language === "zh" ? "24/7支持" : "Hỗ trợ 24/7",
      description:
        language === "en"
          ? "Round-the-clock customer support"
          : language === "zh"
            ? "全天候客户支持"
            : "Hỗ trợ khách hàng 24/7",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#e8f2ec] to-[#f8fbfa] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="mb-12"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center">
                    <div>
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h2>
                      <p className="text-xl text-white/90">{slide.subtitle}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0e1a13] mb-6">
              {language === "en" ? "3D Model Store" : language === "zh" ? "3D模型商店" : "Cửa Hàng Mô Hình 3D"}
            </h1>
            <p className="text-xl text-[#51946b] mb-8 max-w-2xl mx-auto">
              {language === "en"
                ? "Your one-stop destination for high-quality 3D models. Browse our extensive collection of ready-to-use assets."
                : language === "zh"
                  ? "您的一站式高质量3D模型目的地。浏览我们丰富的即用型资源集合。"
                  : "Điểm đến một cửa cho các mô hình 3D chất lượng cao. Khám phá bộ sưu tập tài nguyên sẵn sàng sử dụng của chúng tôi."}
            </p>

            {/* Hero Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchAutocomplete
                onSearch={handleSearch}
                placeholder={
                  language === "en"
                    ? "Search for 3D models..."
                    : language === "zh"
                      ? "搜索3D模型..."
                      : "Tìm kiếm mô hình 3D..."
                }
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                <Link href="/products">
                  {language === "en" ? "Browse Models" : language === "zh" ? "浏览模型" : "Duyệt Mô Hình"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#39e079] text-[#39e079]">
                <Link href="/categories">
                  {language === "en" ? "View Categories" : language === "zh" ? "查看分类" : "Xem Danh Mục"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#0e1a13] mb-2">
                {language === "en" ? "Featured Models" : language === "zh" ? "精选模型" : "Mô Hình Nổi Bật"}
              </h2>
              <p className="text-[#51946b]">
                {language === "en"
                  ? "Hand-picked premium 3D models"
                  : language === "zh"
                    ? "精心挑选的优质3D模型"
                    : "Mô hình 3D cao cấp được tuyển chọn"}
              </p>
            </div>
            <Button asChild variant="outline" className="border-[#39e079] text-[#39e079]">
              <Link href="/products">
                {language === "en" ? "View All" : language === "zh" ? "查看全部" : "Xem Tất Cả"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse border-[#d1e6d9]">
                  <CardContent className="p-4">
                    <div className="bg-gray-200 aspect-square mb-4 rounded-lg"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                      <div className="bg-gray-200 h-6 rounded w-2/3"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                      <div className="flex justify-between items-center">
                        <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                        <div className="bg-gray-200 h-8 rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
              >
                {language === "en" ? "Retry" : language === "zh" ? "重试" : "Thử lại"}
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#51946b]">
                {language === "en" ? "No featured products available" : language === "zh" ? "暂无精选产品" : "Không có sản phẩm nổi bật"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="border-[#d1e6d9] hover:shadow-lg transition-shadow group">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={product.imageUrl || product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <Badge className="absolute top-2 right-2 bg-[#39e079] text-[#0e1a13]">
                        {language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật"}
                      </Badge>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-[#0e1a13] mb-2 hover:text-[#39e079] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-[#51946b] mb-2">{product.category.name}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-[#51946b] ml-1">
                          {product.rating} ({product.downloads})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-[#0e1a13]">{formatCurrency(Number(product.price), language)}</span>
                    </div>

                    <Button className="w-full bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                      {language === "en" ? "Add to Cart" : language === "zh" ? "加入购物车" : "Thêm vào giỏ"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0e1a13] mb-4">
              {language === "en" ? "Browse by Category" : language === "zh" ? "按分类浏览" : "Duyệt Theo Danh Mục"}
            </h2>
            <p className="text-[#51946b] max-w-2xl mx-auto">
              {language === "en"
                ? "Explore our diverse collection of 3D models organized by category"
                : language === "zh"
                  ? "探索我们按分类整理的多样化3D模型收藏"
                  : "Khám phá bộ sưu tập đa dạng các mô hình 3D được sắp xếp theo danh mục"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(categories.length > 0 ? categories : mockCategories).map((category) => (
              <Link key={category.id} href={`/categories/${category.slug || category.id}`}>
                <Card className="border-[#d1e6d9] hover:shadow-lg transition-all group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4 overflow-hidden rounded-full">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold text-[#0e1a13] mb-2 group-hover:text-[#39e079] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[#51946b] mb-2">{category.description}</p>
                    <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                      {category.count || category._count?.products || 0} {language === "en" ? "models" : language === "zh" ? "个模型" : "mô hình"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0e1a13] mb-4">
              {language === "en" ? "Why Choose Us" : language === "zh" ? "为什么选择我们" : "Tại Sao Chọn Chúng Tôi"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#e8f2ec] rounded-full flex items-center justify-center mx-auto mb-4 text-[#39e079]">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[#0e1a13] mb-2">{feature.title}</h3>
                <p className="text-[#51946b]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0e1a13]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {language === "en"
              ? "Ready to Start Creating?"
              : language === "zh"
                ? "准备开始创作了吗？"
                : "Sẵn Sàng Bắt Đầu Sáng Tạo?"}
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            {language === "en"
              ? "Join thousands of creators who trust our 3D models for their projects"
              : language === "zh"
                ? "加入数千名信任我们3D模型的创作者"
                : "Tham gia cùng hàng nghìn nhà sáng tạo tin tưởng mô hình 3D của chúng tôi"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
              <Link href="/register">
                {language === "en" ? "Get Started" : language === "zh" ? "开始使用" : "Bắt Đầu"}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#0e1a13]"
            >
              <Link href="/products">
                {language === "en" ? "Browse Models" : language === "zh" ? "浏览模型" : "Duyệt Mô Hình"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
