"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Star, Heart, Share2, Download, Eye, ShoppingCart, ArrowLeft, Zap, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/hooks/use-language"
import { formatCurrency } from "@/lib/i18n"
import Image from "next/image"
import Link from "next/link"

// Mock product data
const getProductData = (id: string, language: string) => ({
  id,
  name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
  category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
  subcategory: language === "en" ? "Residential" : language === "zh" ? "住宅" : "Nhà ở",
  price: 299000,
  originalPrice: 399000,
  rating: 4.8,
  reviews: 124,
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  description:
    language === "en"
      ? "A stunning modern villa 3D model featuring contemporary architecture with clean lines, large windows, and premium materials. Perfect for architectural visualization, game development, and design projects."
      : language === "zh"
        ? "令人惊叹的现代别墅3D模型，具有当代建筑风格，线条简洁，大窗户和优质材料。非常适合建筑可视化、游戏开发和设计项目。"
        : "Mô hình 3D villa hiện đại tuyệt đẹp với kiến trúc đương đại, đường nét sạch sẽ, cửa sổ lớn và vật liệu cao cấp. Hoàn hảo cho trực quan hóa kiến trúc, phát triển game và các dự án thiết kế.",
  specifications: {
    format: ["FBX", "OBJ", "BLEND"],
    polygons: 15000,
    vertices: 18500,
    textures: true,
    materials: 12,
    rigged: false,
    animated: false,
    fileSize: "45 MB",
    compatibility: ["Blender", "Maya", "3ds Max", "Unity", "Unreal Engine"],
  },
  tags:
    language === "en"
      ? ["villa", "modern", "architecture", "residential", "contemporary", "luxury"]
      : language === "zh"
        ? ["别墅", "现代", "建筑", "住宅", "当代", "豪华"]
        : ["villa", "hiện đại", "kiến trúc", "nhà ở", "đương đại", "sang trọng"],
  featured: true,
  discount: 25,
  downloads: 1250,
  views: 8900,
})

const getRelatedProducts = (language: string) => [
  {
    id: "2",
    name: language === "en" ? "Contemporary House" : language === "zh" ? "当代住宅" : "Nhà Đương Đại",
    price: 250000,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: language === "en" ? "Luxury Mansion" : language === "zh" ? "豪华别墅" : "Biệt Thự Sang Trọng",
    price: 450000,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: language === "en" ? "Modern Apartment" : language === "zh" ? "现代公寓" : "Căn Hộ Hiện Đại",
    price: 180000,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
  },
]

const getReviews = (language: string) => [
  {
    id: 1,
    user: "Alex Chen",
    rating: 5,
    date: "2024-01-15",
    comment:
      language === "en"
        ? "Excellent quality model with great attention to detail. Perfect for my architectural visualization project!"
        : language === "zh"
          ? "优质的模型，细节处理得很好。非常适合我的建筑可视化项目！"
          : "Mô hình chất lượng tuyệt vời với sự chú ý đến chi tiết. Hoàn hảo cho dự án trực quan hóa kiến trúc của tôi!",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    rating: 4,
    date: "2024-01-10",
    comment:
      language === "en"
        ? "Good model overall, textures are high quality. Would recommend for game development."
        : language === "zh"
          ? "总体来说是个好模型，纹理质量很高。推荐用于游戏开发。"
          : "Mô hình tốt nhìn chung, texture chất lượng cao. Khuyến nghị cho phát triển game.",
  },
  {
    id: 3,
    user: "Mike Rodriguez",
    rating: 5,
    date: "2024-01-05",
    comment:
      language === "en"
        ? "Amazing work! The level of detail is incredible. Worth every penny."
        : language === "zh"
          ? "令人惊叹的作品！细节水平令人难以置信。物有所值。"
          : "Công việc tuyệt vời! Mức độ chi tiết thật đáng kinh ngạc. Đáng từng đồng tiền.",
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const { language, t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const product = getProductData(params.id as string, language)
  const relatedProducts = getRelatedProducts(language)
  const reviews = getReviews(language)

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: language === "en" ? "High Quality" : language === "zh" ? "高品质" : "Chất lượng cao",
      description:
        language === "en"
          ? "Premium textures and materials"
          : language === "zh"
            ? "优质纹理和材料"
            : "Texture và vật liệu cao cấp",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: language === "en" ? "Commercial License" : language === "zh" ? "商业许可" : "Giấy phép thương mại",
      description:
        language === "en"
          ? "Use in commercial projects"
          : language === "zh"
            ? "可用于商业项目"
            : "Sử dụng trong dự án thương mại",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: language === "en" ? "Quality Guaranteed" : language === "zh" ? "质量保证" : "Đảm bảo chất lượng",
      description:
        language === "en"
          ? "30-day money back guarantee"
          : language === "zh"
            ? "30天退款保证"
            : "Đảm bảo hoàn tiền 30 ngày",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-[#51946b]">
          <Link href="/" className="hover:text-[#39e079]">
            {t.header.home}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#39e079]">
            {t.header.products}
          </Link>
          <span>/</span>
          <span className="text-[#0e1a13]">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "en" ? "Back to Products" : language === "zh" ? "返回产品" : "Quay lại Sản phẩm"}
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-white border border-[#d1e6d9]">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                  -{product.discount}%
                </Badge>
              )}
              {product.featured && (
                <Badge className="absolute top-4 right-4 bg-[#39e079] text-[#0e1a13] text-lg px-3 py-1">
                  {language === "en" ? "Featured" : language === "zh" ? "精选" : "Nổi bật"}
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? "border-[#39e079]" : "border-[#d1e6d9]"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[#51946b]">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="text-[#51946b]">
                  {product.subcategory}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-[#0e1a13] mb-4">{product.name}</h1>

              {/* Rating and Stats */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-[#0e1a13]">{product.rating}</span>
                  <span className="text-[#51946b]">
                    ({product.reviews} {t.product.reviews_count})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#51946b]">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{product.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{product.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-[#0e1a13]">{formatCurrency(product.price, language)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-[#51946b] line-through">
                    {formatCurrency(product.originalPrice, language)}
                  </span>
                )}
                {product.discount && (
                  <Badge className="bg-green-100 text-green-800">
                    {language === "en" ? "Save" : language === "zh" ? "节省" : "Tiết kiệm"}{" "}
                    {formatCurrency(product.originalPrice! - product.price, language)}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-[#51946b] mb-6">{product.description}</p>

              {/* Features */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#e8f2ec] rounded-lg">
                    <div className="text-[#39e079]">{feature.icon}</div>
                    <div>
                      <h4 className="font-medium text-[#0e1a13]">{feature.title}</h4>
                      <p className="text-sm text-[#51946b]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t.product.add_to_cart}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`border-[#d1e6d9] ${isWishlisted ? "bg-red-50 text-red-600" : ""}`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="lg" className="border-[#d1e6d9]">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <Button variant="outline" size="lg" className="w-full border-[#39e079] text-[#39e079]">
                  <Download className="w-5 h-5 mr-2" />
                  {language === "en" ? "Download Preview" : language === "zh" ? "下载预览" : "Tải Xuống Xem Trước"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="border-[#d1e6d9] mb-12">
          <CardContent className="p-6">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="specifications">
                  {language === "en" ? "Specifications" : language === "zh" ? "规格" : "Thông số"}
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  {language === "en" ? "Reviews" : language === "zh" ? "评价" : "Đánh giá"} ({product.reviews})
                </TabsTrigger>
                <TabsTrigger value="license">
                  {language === "en" ? "License" : language === "zh" ? "许可证" : "Giấy phép"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "File Formats" : language === "zh" ? "文件格式" : "Định dạng file"}
                      </span>
                      <span className="text-[#51946b]">{product.specifications.format.join(", ")}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "Polygons" : language === "zh" ? "多边形" : "Đa giác"}
                      </span>
                      <span className="text-[#51946b]">{product.specifications.polygons.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "Vertices" : language === "zh" ? "顶点" : "Đỉnh"}
                      </span>
                      <span className="text-[#51946b]">{product.specifications.vertices.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "Materials" : language === "zh" ? "材质" : "Vật liệu"}
                      </span>
                      <span className="text-[#51946b]">{product.specifications.materials}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "File Size" : language === "zh" ? "文件大小" : "Kích thước file"}
                      </span>
                      <span className="text-[#51946b]">{product.specifications.fileSize}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "Textures" : language === "zh" ? "纹理" : "Texture"}
                      </span>
                      <Badge variant={product.specifications.textures ? "default" : "secondary"}>
                        {product.specifications.textures
                          ? language === "en"
                            ? "Included"
                            : language === "zh"
                              ? "包含"
                              : "Có"
                          : language === "en"
                            ? "Not included"
                            : language === "zh"
                              ? "不包含"
                              : "Không có"}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "Rigged" : language === "zh" ? "绑定" : "Rigging"}
                      </span>
                      <Badge variant={product.specifications.rigged ? "default" : "secondary"}>
                        {product.specifications.rigged
                          ? language === "en"
                            ? "Yes"
                            : language === "zh"
                              ? "是"
                              : "Có"
                          : language === "en"
                            ? "No"
                            : language === "zh"
                              ? "否"
                              : "Không"}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#e8f2ec]">
                      <span className="font-medium text-[#0e1a13]">
                        {language === "en" ? "Animated" : language === "zh" ? "动画" : "Animation"}
                      </span>
                      <Badge variant={product.specifications.animated ? "default" : "secondary"}>
                        {product.specifications.animated
                          ? language === "en"
                            ? "Yes"
                            : language === "zh"
                              ? "是"
                              : "Có"
                          : language === "en"
                            ? "No"
                            : language === "zh"
                              ? "否"
                              : "Không"}
                      </Badge>
                    </div>

                    <div className="pt-4">
                      <h4 className="font-medium text-[#0e1a13] mb-3">
                        {language === "en"
                          ? "Compatible Software"
                          : language === "zh"
                            ? "兼容软件"
                            : "Phần mềm tương thích"}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.specifications.compatibility.map((software) => (
                          <Badge key={software} variant="outline" className="text-[#51946b]">
                            {software}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <div className="flex items-center gap-8 p-6 bg-[#f8fbfa] rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0e1a13]">{product.rating}</div>
                      <div className="flex items-center justify-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-[#51946b]">
                        {product.reviews} {t.product.reviews_count}
                      </div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-[#51946b] w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${stars === 5 ? 60 : stars === 4 ? 30 : stars === 3 ? 8 : stars === 2 ? 2 : 0}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-[#51946b] w-8">
                            {stars === 5 ? 75 : stars === 4 ? 37 : stars === 3 ? 10 : stars === 2 ? 2 : 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 border border-[#e8f2ec] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#39e079] rounded-full flex items-center justify-center text-[#0e1a13] font-semibold">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-[#0e1a13]">{review.user}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-[#51946b]">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[#51946b]">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="license" className="mt-6">
                <div className="space-y-6">
                  <div className="p-6 bg-[#e8f2ec] rounded-lg">
                    <h3 className="font-semibold text-[#0e1a13] mb-3">
                      {language === "en"
                        ? "Standard License"
                        : language === "zh"
                          ? "标准许可证"
                          : "Giấy phép tiêu chuẩn"}
                    </h3>
                    <ul className="space-y-2 text-[#51946b]">
                      <li>
                        ✓{" "}
                        {language === "en"
                          ? "Use in personal and commercial projects"
                          : language === "zh"
                            ? "可用于个人和商业项目"
                            : "Sử dụng trong dự án cá nhân và thương mại"}
                      </li>
                      <li>
                        ✓{" "}
                        {language === "en"
                          ? "Modify and adapt the model"
                          : language === "zh"
                            ? "修改和调整模型"
                            : "Chỉnh sửa và điều chỉnh mô hình"}
                      </li>
                      <li>
                        ✓{" "}
                        {language === "en"
                          ? "Use in games, films, and applications"
                          : language === "zh"
                            ? "用于游戏、电影和应用程序"
                            : "Sử dụng trong game, phim và ứng dụng"}
                      </li>
                      <li>
                        ✓{" "}
                        {language === "en"
                          ? "No attribution required"
                          : language === "zh"
                            ? "无需署名"
                            : "Không cần ghi công"}
                      </li>
                      <li>
                        ✗{" "}
                        {language === "en"
                          ? "Cannot resell or redistribute the original model"
                          : language === "zh"
                            ? "不能转售或重新分发原始模型"
                            : "Không thể bán lại hoặc phân phối lại mô hình gốc"}
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 border border-[#d1e6d9] rounded-lg">
                    <h4 className="font-medium text-[#0e1a13] mb-2">
                      {language === "en"
                        ? "Need Extended License?"
                        : language === "zh"
                          ? "需要扩展许可证？"
                          : "Cần Giấy phép Mở rộng?"}
                    </h4>
                    <p className="text-[#51946b] mb-4">
                      {language === "en"
                        ? "For resale rights and unlimited distribution, upgrade to our Extended License."
                        : language === "zh"
                          ? "如需转售权和无限分发，请升级到我们的扩展许可证。"
                          : "Để có quyền bán lại và phân phối không giới hạn, hãy nâng cấp lên Giấy phép Mở rộng của chúng tôi."}
                    </p>
                    <Button variant="outline" className="border-[#39e079] text-[#39e079]">
                      {language === "en" ? "Learn More" : language === "zh" ? "了解更多" : "Tìm hiểu thêm"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold text-[#0e1a13] mb-6">
            {language === "en" ? "Related Products" : language === "zh" ? "相关产品" : "Sản phẩm liên quan"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="border-[#d1e6d9] hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <Link href={`/products/${relatedProduct.id}`}>
                    <h3 className="font-semibold text-[#0e1a13] mb-2 hover:text-[#39e079] transition-colors">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0e1a13]">{formatCurrency(relatedProduct.price, language)}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-[#51946b] ml-1">{relatedProduct.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
