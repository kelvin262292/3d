"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useLanguage } from "@/hooks/use-language"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, MousePointer, Clock, Globe, Smartphone, Monitor, Tablet } from "lucide-react"

interface UserBehaviorAnalyticsProps {
  timeRange: string
}

const getUserBehaviorData = (language: string) => ({
  userEngagement: [
    { day: "Mon", visitors: 1200, pageViews: 3600, sessionDuration: 4.2 },
    { day: "Tue", visitors: 1050, pageViews: 3150, sessionDuration: 3.8 },
    { day: "Wed", visitors: 1350, pageViews: 4050, sessionDuration: 4.5 },
    { day: "Thu", visitors: 1180, pageViews: 3540, sessionDuration: 4.1 },
    { day: "Fri", visitors: 1420, pageViews: 4260, sessionDuration: 4.7 },
    { day: "Sat", visitors: 1680, pageViews: 5040, sessionDuration: 5.2 },
    { day: "Sun", visitors: 1520, pageViews: 4560, sessionDuration: 4.9 },
  ],
  deviceBreakdown: [
    { device: language === "en" ? "Desktop" : language === "zh" ? "桌面" : "Máy tính", users: 4520, percentage: 52 },
    { device: language === "en" ? "Mobile" : language === "zh" ? "手机" : "Di động", users: 3240, percentage: 37 },
    { device: language === "en" ? "Tablet" : language === "zh" ? "平板" : "Máy tính bảng", users: 960, percentage: 11 },
  ],
  topPages: [
    {
      page: "/products",
      title: language === "en" ? "Products" : language === "zh" ? "产品" : "Sản phẩm",
      views: 12400,
      uniqueViews: 8900,
      avgTime: "3:45",
      bounceRate: 32,
    },
    {
      page: "/categories",
      title: language === "en" ? "Categories" : language === "zh" ? "分类" : "Danh mục",
      views: 8700,
      uniqueViews: 6200,
      avgTime: "2:30",
      bounceRate: 28,
    },
    {
      page: "/",
      title: language === "en" ? "Home" : language === "zh" ? "首页" : "Trang chủ",
      views: 15600,
      uniqueViews: 11200,
      avgTime: "1:45",
      bounceRate: 45,
    },
    {
      page: "/search",
      title: language === "en" ? "Search" : language === "zh" ? "搜索" : "Tìm kiếm",
      views: 5400,
      uniqueViews: 4100,
      avgTime: "4:20",
      bounceRate: 25,
    },
  ],
  userFlow: [
    { step: language === "en" ? "Landing" : language === "zh" ? "着陆" : "Đến trang", users: 10000, color: "#39e079" },
    { step: language === "en" ? "Browse" : language === "zh" ? "浏览" : "Duyệt", users: 7500, color: "#0ea5e9" },
    {
      step: language === "en" ? "Product View" : language === "zh" ? "产品查看" : "Xem sản phẩm",
      users: 4200,
      color: "#8b5cf6",
    },
    {
      step: language === "en" ? "Add to Cart" : language === "zh" ? "加入购物车" : "Thêm vào giỏ",
      users: 1800,
      color: "#f59e0b",
    },
    { step: language === "en" ? "Checkout" : language === "zh" ? "结账" : "Thanh toán", users: 520, color: "#ef4444" },
  ],
  trafficSources: [
    { source: language === "en" ? "Direct" : language === "zh" ? "直接" : "Trực tiếp", users: 3200, percentage: 36.8 },
    { source: language === "en" ? "Search" : language === "zh" ? "搜索" : "Tìm kiếm", users: 2800, percentage: 32.1 },
    {
      source: language === "en" ? "Social" : language === "zh" ? "社交" : "Mạng xã hội",
      users: 1600,
      percentage: 18.4,
    },
    {
      source: language === "en" ? "Referral" : language === "zh" ? "推荐" : "Giới thiệu",
      users: 1100,
      percentage: 12.7,
    },
  ],
  demographics: {
    ageGroups: [
      { age: "18-24", users: 1200, percentage: 15.8 },
      { age: "25-34", users: 2800, percentage: 36.9 },
      { age: "35-44", users: 2100, percentage: 27.6 },
      { age: "45-54", users: 1000, percentage: 13.2 },
      { age: "55+", users: 500, percentage: 6.5 },
    ],
    topCountries: [
      { country: language === "en" ? "United States" : language === "zh" ? "美国" : "Hoa Kỳ", users: 2800, flag: "🇺🇸" },
      {
        country: language === "en" ? "United Kingdom" : language === "zh" ? "英国" : "Vương quốc Anh",
        users: 1200,
        flag: "🇬🇧",
      },
      { country: language === "en" ? "Germany" : language === "zh" ? "德国" : "Đức", users: 980, flag: "🇩🇪" },
      { country: language === "en" ? "Canada" : language === "zh" ? "加拿大" : "Canada", users: 760, flag: "🇨🇦" },
      { country: language === "en" ? "Australia" : language === "zh" ? "澳大利亚" : "Úc", users: 540, flag: "🇦🇺" },
    ],
  },
})

export default function UserBehaviorAnalytics({ timeRange }: UserBehaviorAnalyticsProps) {
  const { language } = useLanguage()
  const behaviorData = getUserBehaviorData(language)

  const engagementMetrics = [
    {
      title: language === "en" ? "Total Visitors" : language === "zh" ? "总访客" : "Tổng khách truy cập",
      value: "8,720",
      change: 12.5,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: language === "en" ? "Avg Session Duration" : language === "zh" ? "平均会话时长" : "Thời lượng phiên TB",
      value: "4m 23s",
      change: 8.3,
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: language === "en" ? "Pages per Session" : language === "zh" ? "每会话页面数" : "Trang mỗi phiên",
      value: "3.2",
      change: 5.7,
      icon: MousePointer,
      color: "text-purple-600",
    },
    {
      title: language === "en" ? "Bounce Rate" : language === "zh" ? "跳出率" : "Tỷ lệ thoát",
      value: "34.2%",
      change: -3.1,
      icon: Globe,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => (
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
        {/* User Engagement Chart */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Daily Engagement" : language === "zh" ? "每日参与度" : "Mức độ tương tác hàng ngày"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: {
                  label: language === "en" ? "Visitors" : language === "zh" ? "访客" : "Khách truy cập",
                  color: "#39e079",
                },
                pageViews: {
                  label: language === "en" ? "Page Views" : language === "zh" ? "页面浏览" : "Lượt xem trang",
                  color: "#0ea5e9",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={behaviorData.userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stackId="1"
                    stroke="#39e079"
                    fill="#39e079"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stackId="2"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Device Usage" : language === "zh" ? "设备使用情况" : "Sử dụng thiết bị"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {behaviorData.deviceBreakdown.map((device, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device.device.includes("Desktop") ||
                    device.device.includes("桌面") ||
                    device.device.includes("Máy tính") ? (
                      <Monitor className="w-4 h-4 text-[#51946b]" />
                    ) : device.device.includes("Mobile") ||
                      device.device.includes("手机") ||
                      device.device.includes("Di động") ? (
                      <Smartphone className="w-4 h-4 text-[#51946b]" />
                    ) : (
                      <Tablet className="w-4 h-4 text-[#51946b]" />
                    )}
                    <span className="font-medium text-[#0e1a13]">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-[#0e1a13]">{device.users.toLocaleString()}</span>
                    <span className="text-sm text-[#51946b] ml-2">({device.percentage}%)</span>
                  </div>
                </div>
                <Progress value={device.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Top Pages" : language === "zh" ? "热门页面" : "Trang phổ biến"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {behaviorData.topPages.map((page, index) => (
                <div key={index} className="p-4 bg-[#f8fbfa] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#0e1a13]">{page.title}</h4>
                    <Badge
                      variant={page.bounceRate < 30 ? "default" : page.bounceRate < 40 ? "secondary" : "destructive"}
                      className={
                        page.bounceRate < 30
                          ? "bg-green-100 text-green-800"
                          : page.bounceRate < 40
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {page.bounceRate}% bounce
                    </Badge>
                  </div>
                  <p className="text-sm text-[#51946b] mb-2">{page.page}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[#51946b]">
                        {language === "en" ? "Views" : language === "zh" ? "浏览量" : "Lượt xem"}
                      </p>
                      <p className="font-semibold text-[#0e1a13]">{page.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#51946b]">
                        {language === "en" ? "Unique" : language === "zh" ? "独立" : "Duy nhất"}
                      </p>
                      <p className="font-semibold text-[#0e1a13]">{page.uniqueViews.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#51946b]">
                        {language === "en" ? "Avg Time" : language === "zh" ? "平均时间" : "Thời gian TB"}
                      </p>
                      <p className="font-semibold text-[#0e1a13]">{page.avgTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-[#0e1a13]">
              {language === "en" ? "Traffic Sources" : language === "zh" ? "流量来源" : "Nguồn lưu lượng"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {behaviorData.trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#0e1a13]">{source.source}</span>
                  <div className="text-right">
                    <span className="font-semibold text-[#0e1a13]">{source.users.toLocaleString()}</span>
                    <span className="text-sm text-[#51946b] ml-2">({source.percentage}%)</span>
                  </div>
                </div>
                <Progress value={source.percentage} className="h-2" />
              </div>
            ))}

            {/* Top Countries */}
            <div className="mt-6">
              <h4 className="font-semibold text-[#0e1a13] mb-3">
                {language === "en" ? "Top Countries" : language === "zh" ? "热门国家" : "Quốc gia hàng đầu"}
              </h4>
              <div className="space-y-2">
                {behaviorData.demographics.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium text-[#0e1a13]">{country.country}</span>
                    </div>
                    <span className="font-semibold text-[#0e1a13]">{country.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Flow Funnel */}
      <Card className="border-[#d1e6d9]">
        <CardHeader>
          <CardTitle className="text-[#0e1a13]">
            {language === "en"
              ? "User Journey Funnel"
              : language === "zh"
                ? "用户旅程漏斗"
                : "Phễu hành trình người dùng"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {behaviorData.userFlow.map((step, index) => {
              const conversionRate =
                index > 0 ? ((step.users / behaviorData.userFlow[index - 1].users) * 100).toFixed(1) : 100
              const dropOffRate = index > 0 ? (100 - Number.parseFloat(conversionRate)).toFixed(1) : 0

              return (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4 p-4 bg-[#f8fbfa] rounded-lg">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: step.color }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#0e1a13]">{step.step}</h4>
                        <div className="text-right">
                          <p className="font-bold text-[#0e1a13]">{step.users.toLocaleString()}</p>
                          <p className="text-sm text-[#51946b]">
                            {language === "en" ? "users" : language === "zh" ? "用户" : "người dùng"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={(step.users / behaviorData.userFlow[0].users) * 100} className="h-2" />
                      </div>
                      {index > 0 && (
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="text-green-600">
                            {language === "en" ? "Conversion" : language === "zh" ? "转化" : "Chuyển đổi"}:{" "}
                            {conversionRate}%
                          </span>
                          <span className="text-red-600">
                            {language === "en" ? "Drop-off" : language === "zh" ? "流失" : "Rời bỏ"}: {dropOffRate}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
