"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/hooks/use-language"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Package, TrendingUp, TrendingDown, Eye, Download, Star } from "lucide-react"
import { useState } from "react"

interface ProductAnalyticsProps {
  timeRange: string
}

const getProductData = (language: string) => ({
  topPerformers: [
    {
      id: "1",
      name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
      category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      views: 12400,
      downloads: 890,
      sales: 156,
      revenue: 46680,
      rating: 4.8,
      conversionRate: 7.2,
      trend: 23.5,
    },
    {
      id: "2",
      name: language === "en" ? "Ferrari Sports Car" : language === "zh" ? "法拉利跑车" : "Xe Thể Thao Ferrari",
      category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      views: 9800,
      downloads: 720,
      sales: 134,
      revenue: 60300,
      rating: 4.9,
      conversionRate: 7.3,
      trend: 18.2,
    },
    {
      id: "3",
      name: language === "en" ? "Anime Character Pack" : language === "zh" ? "动漫角色包" : "Gói Nhân Vật Anime",
      category: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
      views: 8600,
      downloads: 650,
      sales: 89,
      revenue: 17780,
      rating: 4.7,
      conversionRate: 7.6,
      trend: 31.4,
    },
  ],
  categoryPerformance: [
    {
      category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      products: 156,
      views: 45600,
      sales: 890,
      revenue: 45000,
      avgRating: 4.6,
      conversionRate: 2.0,
    },
    {
      category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      products: 89,
      views: 38200,
      sales: 720,
      revenue: 38000,
      avgRating: 4.7,
      conversionRate: 1.9,
    },
    {
      category: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
      products: 234,
      views: 52400,
      sales: 650,
      revenue: 32000,
      avgRating: 4.5,
      conversionRate: 1.2,
    },
    {
      category: language === "en" ? "Furniture" : language === "zh" ? "家具" : "Nội thất",
      products: 123,
      views: 28900,
      sales: 456,
      revenue: 18000,
      avgRating: 4.4,
      conversionRate: 1.6,
    },
  ],
  searchTerms: [
    { term: "modern villa", searches: 1240, conversions: 89, rate: 7.2 },
    { term: "sports car", searches: 980, conversions: 67, rate: 6.8 },
    { term: "anime character", searches: 876, conversions: 54, rate: 6.2 },
    { term: "office building", searches: 654, conversions: 32, rate: 4.9 },
    { term: "fantasy dragon", searches: 543, conversions: 28, rate: 5.2 },
  ],
  viewsToSales: [
    { month: "Jan", views: 42000, sales: 340, conversionRate: 0.81 },
    { month: "Feb", views: 45000, sales: 398, conversionRate: 0.88 },
    { month: "Mar", views: 43000, sales: 365, conversionRate: 0.85 },
    { month: "Apr", views: 48000, sales: 425, conversionRate: 0.89 },
    { month: "May", views: 52000, sales: 456, conversionRate: 0.88 },
    { month: "Jun", views: 55000, sales: 512, conversionRate: 0.93 },
  ],
  priceAnalysis: [
    { range: "$0-50", products: 145, sales: 1200, avgPrice: 25, revenue: 30000 },
    { range: "$50-100", products: 89, sales: 890, avgPrice: 75, revenue: 66750 },
    { range: "$100-200", products: 67, sales: 456, avgPrice: 150, revenue: 68400 },
    { range: "$200-500", products: 34, sales: 234, avgPrice: 350, revenue: 81900 },
    { range: "$500+", products: 12, sales: 78, avgPrice: 750, revenue: 58500 },
  ],
})

export default function ProductAnalytics({ timeRange }: ProductAnalyticsProps) {
  const { language } = useLanguage()
  const [selectedMetric, setSelectedMetric] = useState("views")
  const productData = getProductData(language)

  const overviewMetrics = [
    {
      title: language === "en" ? "Total Products" : language === "zh" ? "总产品数" : "Tổng sản phẩm",
      value: "547",
      change: 8.3,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: language === "en" ? "Total Views" : language === "zh" ? "总浏览量" : "Tổng lượt xem",
      value: "165.2K",
      change: 12.5,
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: language === "en" ? "Total Downloads" : language === "zh" ? "总下载量" : "Tổng lượt tải",
      value: "12.8K",
      change: 18.7,
      icon: Download,
      color: "text-purple-600",
    },
    {
      title: language === "en" ? "Avg Rating" : language === "zh" ? "平均评分" : "Đánh giá TB",
      value: "4.6",
      change: 2.1,
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => (
          <Card key={index} className="border-[#d1e6d9]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#51946b]">{metric.title}</p>
                  <p className="text-2xl font-bold text-[#0e1a13]">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {metric.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${metric.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {metric.change >= 0 ? "+" : ""}
                  {metric.change}%
                </span>
                <span className="text-sm text-[#51946b] ml-1">
                  {language === "en" ? "vs last period" : language === "zh" ? "与上期相比" : "so với kỳ trước"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views to Sales Conversion */}
        <Card className="border-[#d1e6d9]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Views to Sales" : language === "zh" ? "浏览到销售" : "Lượt xem đến bán hàng"}
            </CardTitle>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">
                  {language === "en" ? "Views" : language === "zh" ? "浏览量" : "Lượt xem"}
                </SelectItem>
                <SelectItem value="sales">
                  {language === "en" ? "Sales" : language === "zh" ? "销售" : "Bán hàng"}
                </SelectItem>
                <SelectItem value="conversionRate">
                  {language === "en" ? "Conversion" : language === "zh" ? "转化率" : "Chuyển đổi"}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                views: {
                  label: language === "en" ? "Views" : language === "zh" ? "浏览量" : "Lượt xem",
                  color: "#39e079",
                },
                sales: {
                  label: language === "en" ? "Sales" : language === "zh" ? "销售" : "Bán hàng",
                  color: "#0ea5e9",
                },
                conversionRate: {
                  label: language === "en" ? "Conversion Rate" : language === "zh" ? "转化率" : "Tỷ lệ chuyển đổi",
                  color: "#8b5cf6",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productData.viewsToSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={selectedMetric === "views" ? "#39e079" : selectedMetric === "sales" ? "#0ea5e9" : "#8b5cf6"}
                    fill={selectedMetric === "views" ? "#39e079" : selectedMetric === "sales" ? "#0ea5e9" : "#8b5cf6"}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Price Analysis */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en"
                ? "Revenue by Price Range"
                : language === "zh"
                  ? "按价格范围收入"
                  : "Doanh thu theo khoảng giá"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu",
                  color: "#39e079",
                },
                sales: {
                  label: language === "en" ? "Sales" : language === "zh" ? "销售" : "Bán hàng",
                  color: "#0ea5e9",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData.priceAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#39e079" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Products */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en"
                ? "Top Performing Products"
                : language === "zh"
                  ? "表现最佳产品"
                  : "Sản phẩm hiệu suất tốt nhất"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productData.topPerformers.map((product, index) => (
                <div key={product.id} className="p-4 bg-[#f8fbfa] rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#39e079] rounded-full flex items-center justify-center text-[#0e1a13] font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0e1a13]">{product.name}</h4>
                        <p className="text-sm text-[#51946b]">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">+{product.trend}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-[#51946b]">
                        {language === "en" ? "Views" : language === "zh" ? "浏览量" : "Lượt xem"}
                      </p>
                      <p className="font-semibold text-[#0e1a13]">{product.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#51946b]">
                        {language === "en" ? "Sales" : language === "zh" ? "销售" : "Bán hàng"}
                      </p>
                      <p className="font-semibold text-[#0e1a13]">{product.sales}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#51946b]">
                        {language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu"}
                      </p>
                      <p className="font-semibold text-[#0e1a13]">${product.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#51946b]">
                        {language === "en" ? "Rating" : language === "zh" ? "评分" : "Đánh giá"}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-[#0e1a13]">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#51946b]">
                        {language === "en" ? "Conversion Rate" : language === "zh" ? "转化率" : "Tỷ lệ chuyển đổi"}
                      </span>
                      <span className="font-semibold text-[#0e1a13]">{product.conversionRate}%</span>
                    </div>
                    <Progress value={product.conversionRate * 10} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Terms Analysis */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Top Search Terms" : language === "zh" ? "热门搜索词" : "Từ khóa tìm kiếm hàng đầu"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productData.searchTerms.map((term, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#f8fbfa] rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-[#0e1a13]">"{term.term}"</h4>
                      <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                        {term.rate}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#51946b]">
                      <span>
                        {term.searches} {language === "en" ? "searches" : language === "zh" ? "搜索" : "tìm kiếm"}
                      </span>
                      <span>
                        {term.conversions}{" "}
                        {language === "en" ? "conversions" : language === "zh" ? "转化" : "chuyển đổi"}
                      </span>
                    </div>
                    <Progress value={term.rate * 10} className="h-2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="border-[#d1e6d9]">
        <CardHeader>
          <CardTitle className="text-[#0e1a13]">
            {language === "en" ? "Category Performance" : language === "zh" ? "分类表现" : "Hiệu suất danh mục"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e8f2ec]">
                  <th className="text-left py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Category" : language === "zh" ? "分类" : "Danh mục"}
                  </th>
                  <th className="text-right py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Products" : language === "zh" ? "产品" : "Sản phẩm"}
                  </th>
                  <th className="text-right py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Views" : language === "zh" ? "浏览量" : "Lượt xem"}
                  </th>
                  <th className="text-right py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Sales" : language === "zh" ? "销售" : "Bán hàng"}
                  </th>
                  <th className="text-right py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu"}
                  </th>
                  <th className="text-right py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Conv. Rate" : language === "zh" ? "转化率" : "Tỷ lệ CV"}
                  </th>
                  <th className="text-right py-3 font-semibold text-[#0e1a13]">
                    {language === "en" ? "Rating" : language === "zh" ? "评分" : "Đánh giá"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {productData.categoryPerformance.map((category, index) => (
                  <tr key={index} className="border-b border-[#f8fbfa]">
                    <td className="py-4 font-medium text-[#0e1a13]">{category.category}</td>
                    <td className="py-4 text-right text-[#51946b]">{category.products}</td>
                    <td className="py-4 text-right text-[#51946b]">{category.views.toLocaleString()}</td>
                    <td className="py-4 text-right text-[#51946b]">{category.sales}</td>
                    <td className="py-4 text-right font-semibold text-[#0e1a13]">
                      ${category.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <Badge
                        variant={category.conversionRate > 1.8 ? "default" : "secondary"}
                        className={
                          category.conversionRate > 1.8 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {category.conversionRate}%
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-[#0e1a13]">{category.avgRating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
