"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { useLanguage } from "@/hooks/use-language"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"

interface RevenueBreakdownProps {
  timeRange: string
}

const getRevenueData = (language: string) => ({
  byCategory: [
    {
      name: language === "en" ? "Architecture" : language === "zh" ? "建筑" : "Kiến trúc",
      value: 45000,
      percentage: 36,
      growth: 15.2,
      color: "#39e079",
    },
    {
      name: language === "en" ? "Vehicles" : language === "zh" ? "车辆" : "Xe cộ",
      value: 38000,
      percentage: 30,
      growth: 8.7,
      color: "#0ea5e9",
    },
    {
      name: language === "en" ? "Characters" : language === "zh" ? "角色" : "Nhân vật",
      value: 32000,
      percentage: 26,
      growth: 22.1,
      color: "#8b5cf6",
    },
    {
      name: language === "en" ? "Others" : language === "zh" ? "其他" : "Khác",
      value: 10000,
      percentage: 8,
      growth: -2.1,
      color: "#f59e0b",
    },
  ],
  monthly: [
    { month: "Jan", subscription: 25000, oneTime: 40000, total: 65000 },
    { month: "Feb", subscription: 27000, oneTime: 45000, total: 72000 },
    { month: "Mar", subscription: 26000, oneTime: 42000, total: 68000 },
    { month: "Apr", subscription: 30000, oneTime: 48000, total: 78000 },
    { month: "May", subscription: 32000, oneTime: 53000, total: 85000 },
    { month: "Jun", subscription: 35000, oneTime: 57000, total: 92000 },
  ],
  paymentMethods: [
    { method: "Credit Card", amount: 78000, percentage: 62.4, color: "#39e079" },
    { method: "PayPal", amount: 32000, percentage: 25.6, color: "#0ea5e9" },
    { method: "Bank Transfer", amount: 12000, percentage: 9.6, color: "#8b5cf6" },
    { method: "Crypto", amount: 3000, percentage: 2.4, color: "#f59e0b" },
  ],
})

export default function RevenueBreakdown({ timeRange }: RevenueBreakdownProps) {
  const { language } = useLanguage()
  const revenueData = getRevenueData(language)

  return (
    <Card className="border-[#d1e6d9]">
      <CardHeader>
        <CardTitle className="text-[#0e1a13]">
          {language === "en" ? "Revenue Breakdown" : language === "zh" ? "收入分析" : "Phân tích doanh thu"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Category Pie Chart */}
          <div>
            <h4 className="font-semibold text-[#0e1a13] mb-4">
              {language === "en" ? "By Category" : language === "zh" ? "按分类" : "Theo danh mục"}
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData.byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueData.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${(value as number).toLocaleString()}`,
                      language === "en" ? "Revenue" : language === "zh" ? "收入" : "Doanh thu",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {revenueData.byCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm text-[#0e1a13]">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0e1a13]">${category.value.toLocaleString()}</span>
                    <div className="flex items-center">
                      {category.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={`text-xs ml-1 ${category.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {category.growth >= 0 ? "+" : ""}
                        {category.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold text-[#0e1a13] mb-4">
              {language === "en" ? "Payment Methods" : language === "zh" ? "支付方式" : "Phương thức thanh toán"}
            </h4>
            <div className="space-y-4">
              {revenueData.paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#0e1a13]">{method.method}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#0e1a13]">${method.amount.toLocaleString()}</span>
                      <span className="text-xs text-[#51946b] ml-2">({method.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${method.percentage}%`,
                        backgroundColor: method.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Revenue Trend */}
            <div className="mt-8">
              <h4 className="font-semibold text-[#0e1a13] mb-4">
                {language === "en" ? "Monthly Trend" : language === "zh" ? "月度趋势" : "Xu hướng hàng tháng"}
              </h4>
              <ChartContainer
                config={{
                  subscription: {
                    label: language === "en" ? "Subscription" : language === "zh" ? "订阅" : "Đăng ký",
                    color: "#39e079",
                  },
                  oneTime: {
                    label: language === "en" ? "One-time" : language === "zh" ? "一次性" : "Một lần",
                    color: "#0ea5e9",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="subscription" stackId="a" fill="#39e079" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="oneTime" stackId="a" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
