"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useLanguage } from "@/hooks/use-language"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Target, CreditCard } from "lucide-react"

interface SalesAnalyticsProps {
  timeRange: string
}

// Mock sales data
const getSalesData = (timeRange: string, language: string) => {
  const dailyRevenue = [
    { date: "Mon", revenue: 4200, orders: 23, aov: 182.6 },
    { date: "Tue", revenue: 3800, orders: 19, aov: 200.0 },
    { date: "Wed", revenue: 5200, orders: 31, aov: 167.7 },
    { date: "Thu", revenue: 4600, orders: 27, aov: 170.4 },
    { date: "Fri", revenue: 6100, orders: 35, aov: 174.3 },
    { date: "Sat", revenue: 7200, orders: 42, aov: 171.4 },
    { date: "Sun", revenue: 5900, orders: 34, aov: 173.5 },
  ]

  const salesByCategory = [
    {
      name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      value: 35,
      revenue: 45000,
      color: "#39e079",
    },
    {
      name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      value: 28,
      revenue: 38000,
      color: "#0ea5e9",
    },
    {
      name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
      value: 22,
      revenue: 32000,
      color: "#8b5cf6",
    },
    {
      name: language === "en" ? "Furniture" : language === "zh" ? "家具" : "Nội thất",
      value: 15,
      revenue: 18000,
      color: "#f59e0b",
    },
  ]

  const topProducts = [
    {
      id: "1",
      name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
      category: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      sales: 156,
      revenue: 46680,
      growth: 23.5,
    },
    {
      id: "2",
      name: language === "en" ? "Ferrari Sports Car" : language === "zh" ? "法拉利跑车" : "Xe Thể Thao Ferrari",
      category: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      sales: 134,
      revenue: 60300,
      growth: 18.2,
    },
    {
      id: "3",
      name: language === "en" ? "Anime Character Pack" : language === "zh" ? "动漫角色包" : "Gói Nhân Vật Anime",
      category: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
      sales: 89,
      revenue: 17780,
      growth: 31.4,
    },
  ]

  const monthlyTrends = [
    { month: "Jan", revenue: 65000, orders: 340, customers: 280 },
    { month: "Feb", revenue: 72000, orders: 398, customers: 320 },
    { month: "Mar", revenue: 68000, orders: 365, customers: 295 },
    { month: "Apr", revenue: 78000, orders: 425, customers: 350 },
    { month: "May", revenue: 85000, orders: 456, customers: 385 },
    { month: "Jun", revenue: 92000, orders: 512, customers: 425 },
  ]

  return {
    dailyRevenue,
    salesByCategory,
    topProducts,
    monthlyTrends,
    summary: {
      totalRevenue: 125000,
      totalOrders: 2340,
      avgOrderValue: 53.4,
      conversionRate: 5.2,
      revenueGrowth: 12.5,
      orderGrowth: 15.2,
      aovGrowth: 7.8,
      conversionGrowth: 3.2,
    },
  }
}

export default function SalesAnalytics({ timeRange }: SalesAnalyticsProps) {
  const { language } = useLanguage()
  const [chartType, setChartType] = useState("revenue")

  const salesData = getSalesData(timeRange, language)

  const summaryCards = [
    {
      title: language === "en" ? "Total Revenue" : language === "zh" ? "总收入" : "Tổng doanh thu",
      value: `$${salesData.summary.totalRevenue.toLocaleString()}`,
      change: salesData.summary.revenueGrowth,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: language === "en" ? "Total Orders" : language === "zh" ? "总订单" : "Tổng đơn hàng",
      value: salesData.summary.totalOrders.toLocaleString(),
      change: salesData.summary.orderGrowth,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: language === "en" ? "Avg Order Value" : language === "zh" ? "平均订单价值" : "Giá trị đơn hàng TB",
      value: `$${salesData.summary.avgOrderValue}`,
      change: salesData.summary.aovGrowth,
      icon: Target,
      color: "text-purple-600",
    },
    {
      title: language === "en" ? "Conversion Rate" : language === "zh" ? "转化率" : "Tỷ lệ chuyển đổi",
      value: `${salesData.summary.conversionRate}%`,
      change: salesData.summary.conversionGrowth,
      icon: CreditCard,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-[#d1e6d9]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Revenue Trends" : language === "zh" ? "收入趋势" : "Xu hướng doanh thu"}
            </CardTitle>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">
                  {language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu"}
                </SelectItem>
                <SelectItem value="orders">
                  {language === "en" ? "Orders" : language === "zh" ? "订单" : "Đơn hàng"}
                </SelectItem>
                <SelectItem value="aov">{language === "en" ? "AOV" : language === "zh" ? "AOV" : "AOV"}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu",
                  color: "#39e079",
                },
                orders: {
                  label: language === "en" ? "Orders" : language === "zh" ? "订单" : "Đơn hàng",
                  color: "#0ea5e9",
                },
                aov: {
                  label: language === "en" ? "AOV" : language === "zh" ? "AOV" : "AOV",
                  color: "#8b5cf6",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey={chartType}
                    stroke={chartType === "revenue" ? "#39e079" : chartType === "orders" ? "#0ea5e9" : "#8b5cf6"}
                    fill={chartType === "revenue" ? "#39e079" : chartType === "orders" ? "#0ea5e9" : "#8b5cf6"}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Sales by Category" : language === "zh" ? "按分类销售" : "Bán hàng theo danh mục"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData.salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {salesData.salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      language === "en" ? "Share" : language === "zh" ? "份额" : "Tỷ lệ",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {salesData.salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm font-medium text-[#0e1a13]">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#0e1a13]">${category.revenue.toLocaleString()}</p>
                    <p className="text-xs text-[#51946b]">{category.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Top Selling Products" : language === "zh" ? "最畅销产品" : "Sản phẩm bán chạy nhất"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#39e079] rounded-full flex items-center justify-center text-[#0e1a13] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0e1a13]">{product.name}</h4>
                      <p className="text-sm text-[#51946b]">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#0e1a13]">${product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-[#51946b]">{product.sales} sales</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">+{product.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Monthly Performance" : language === "zh" ? "月度表现" : "Hiệu suất hàng tháng"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu",
                  color: "#39e079",
                },
                orders: {
                  label: language === "en" ? "Orders" : language === "zh" ? "订单" : "Đơn hàng",
                  color: "#0ea5e9",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#39e079" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
