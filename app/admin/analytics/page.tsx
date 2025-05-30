"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Eye, Download } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import SalesAnalytics from "./components/sales-analytics"
import UserBehaviorAnalytics from "./components/user-behavior-analytics"
import PerformanceMetrics from "./components/performance-metrics"
import ProductAnalytics from "./components/product-analytics"
import ConversionFunnel from "./components/conversion-funnel"
import RevenueBreakdown from "./components/revenue-breakdown"

// Mock analytics data
const getAnalyticsData = (language: string) => ({
  overview: {
    totalRevenue: 125000,
    totalUsers: 8450,
    totalOrders: 2340,
    totalViews: 45600,
    totalDownloads: 12800,
    conversionRate: 5.2,
    avgOrderValue: 53.4,
    returningCustomers: 32.1,
    changeRevenue: 12.5,
    changeUsers: 8.3,
    changeOrders: 15.2,
    changeViews: -2.1,
    changeDownloads: 18.7,
    changeConversion: 3.2,
    changeAOV: 7.8,
    changeReturning: 5.4,
  },
  topCategories: [
    {
      name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      revenue: 45000,
      orders: 890,
      change: 15.2,
    },
    {
      name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      revenue: 38000,
      orders: 720,
      change: 8.7,
    },
    {
      name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
      revenue: 32000,
      orders: 650,
      change: 22.1,
    },
  ],
  recentActivity: [
    {
      type: "sale",
      message:
        language === "en" ? "New order #ORD-1234" : language === "zh" ? "新订单 #ORD-1234" : "Đơn hàng mới #ORD-1234",
      amount: 299,
      time: "2 minutes ago",
    },
    {
      type: "user",
      message: language === "en" ? "New user registered" : language === "zh" ? "新用户注册" : "Người dùng mới đăng ký",
      time: "5 minutes ago",
    },
    {
      type: "download",
      message: language === "en" ? "Product downloaded" : language === "zh" ? "产品已下载" : "Sản phẩm đã tải",
      time: "8 minutes ago",
    },
  ],
})

export default function AnalyticsPage() {
  const { language, t } = useLanguage()
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("overview")

  const analyticsData = getAnalyticsData(language)

  const overviewCards = [
    {
      title: language === "en" ? "Total Revenue" : language === "zh" ? "总收入" : "Tổng doanh thu",
      value: `$${analyticsData.overview.totalRevenue.toLocaleString()}`,
      change: analyticsData.overview.changeRevenue,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: language === "en" ? "Total Users" : language === "zh" ? "总用户" : "Tổng người dùng",
      value: analyticsData.overview.totalUsers.toLocaleString(),
      change: analyticsData.overview.changeUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: language === "en" ? "Total Orders" : language === "zh" ? "总订单" : "Tổng đơn hàng",
      value: analyticsData.overview.totalOrders.toLocaleString(),
      change: analyticsData.overview.changeOrders,
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: language === "en" ? "Page Views" : language === "zh" ? "页面浏览" : "Lượt xem trang",
      value: analyticsData.overview.totalViews.toLocaleString(),
      change: analyticsData.overview.changeViews,
      icon: Eye,
      color: "text-orange-600",
    },
    {
      title: language === "en" ? "Downloads" : language === "zh" ? "下载量" : "Lượt tải",
      value: analyticsData.overview.totalDownloads.toLocaleString(),
      change: analyticsData.overview.changeDownloads,
      icon: Download,
      color: "text-indigo-600",
    },
    {
      title: language === "en" ? "Conversion Rate" : language === "zh" ? "转化率" : "Tỷ lệ chuyển đổi",
      value: `${analyticsData.overview.conversionRate}%`,
      change: analyticsData.overview.changeConversion,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fbfa] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0e1a13]">
              {language === "en"
                ? "Analytics Dashboard"
                : language === "zh"
                  ? "分析仪表板"
                  : "Bảng điều khiển phân tích"}
            </h1>
            <p className="text-[#51946b] mt-1">
              {language === "en"
                ? "Comprehensive insights into your store performance"
                : language === "zh"
                  ? "您商店表现的全面洞察"
                  : "Thông tin chi tiết toàn diện về hiệu suất cửa hàng của bạn"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">
                  {language === "en" ? "Today" : language === "zh" ? "今天" : "Hôm nay"}
                </SelectItem>
                <SelectItem value="7d">
                  {language === "en" ? "7 days" : language === "zh" ? "7天" : "7 ngày"}
                </SelectItem>
                <SelectItem value="30d">
                  {language === "en" ? "30 days" : language === "zh" ? "30天" : "30 ngày"}
                </SelectItem>
                <SelectItem value="90d">
                  {language === "en" ? "90 days" : language === "zh" ? "90天" : "90 ngày"}
                </SelectItem>
                <SelectItem value="1y">{language === "en" ? "1 year" : language === "zh" ? "1年" : "1 năm"}</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
              {language === "en" ? "Export Report" : language === "zh" ? "导出报告" : "Xuất báo cáo"}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewCards.map((card, index) => (
            <Card key={index} className="border-[#d1e6d9]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#51946b]">{card.title}</p>
                    <p className="text-2xl font-bold text-[#0e1a13]">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${card.color}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {card.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${card.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {card.change >= 0 ? "+" : ""}
                    {card.change}%
                  </span>
                  <span className="text-sm text-[#51946b] ml-1">
                    {language === "en" ? "vs last period" : language === "zh" ? "与上期相比" : "so với kỳ trước"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">
              {language === "en" ? "Overview" : language === "zh" ? "概览" : "Tổng quan"}
            </TabsTrigger>
            <TabsTrigger value="sales">
              {language === "en" ? "Sales" : language === "zh" ? "销售" : "Bán hàng"}
            </TabsTrigger>
            <TabsTrigger value="users">
              {language === "en" ? "Users" : language === "zh" ? "用户" : "Người dùng"}
            </TabsTrigger>
            <TabsTrigger value="products">
              {language === "en" ? "Products" : language === "zh" ? "产品" : "Sản phẩm"}
            </TabsTrigger>
            <TabsTrigger value="performance">
              {language === "en" ? "Performance" : language === "zh" ? "性能" : "Hiệu suất"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <Card className="border-[#d1e6d9]">
                <CardHeader>
                  <CardTitle className="text-[#0e1a13]">
                    {language === "en"
                      ? "Revenue by Category"
                      : language === "zh"
                        ? "按分类收入"
                        : "Doanh thu theo danh mục"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#39e079]" />
                          <span className="font-medium text-[#0e1a13]">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#0e1a13]">${category.revenue.toLocaleString()}</p>
                          <p className="text-sm text-[#51946b]">{category.orders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-[#d1e6d9]">
                <CardHeader>
                  <CardTitle className="text-[#0e1a13]">
                    {language === "en" ? "Recent Activity" : language === "zh" ? "最近活动" : "Hoạt động gần đây"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "sale"
                              ? "bg-green-100 text-green-600"
                              : activity.type === "user"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {activity.type === "sale" ? (
                            <DollarSign className="w-4 h-4" />
                          ) : activity.type === "user" ? (
                            <Users className="w-4 h-4" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0e1a13]">{activity.message}</p>
                          <p className="text-xs text-[#51946b]">{activity.time}</p>
                        </div>
                        {activity.amount && (
                          <Badge variant="secondary" className="bg-[#e8f2ec] text-[#51946b]">
                            ${activity.amount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueBreakdown timeRange={timeRange} />
              <ConversionFunnel />
            </div>
          </TabsContent>

          <TabsContent value="sales">
            <SalesAnalytics timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="users">
            <UserBehaviorAnalytics timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="products">
            <ProductAnalytics timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
