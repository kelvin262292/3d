"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/hooks/use-language"
import { Users, Eye, ShoppingCart, CreditCard, Download } from "lucide-react"

const getFunnelData = (language: string) => [
  {
    stage: language === "en" ? "Visitors" : language === "zh" ? "访客" : "Khách truy cập",
    users: 10000,
    percentage: 100,
    dropOff: 0,
    icon: Users,
    color: "#39e079",
    description:
      language === "en" ? "Total site visitors" : language === "zh" ? "网站总访客" : "Tổng khách truy cập trang web",
  },
  {
    stage: language === "en" ? "Product Views" : language === "zh" ? "产品浏览" : "Xem sản phẩm",
    users: 6500,
    percentage: 65,
    dropOff: 35,
    icon: Eye,
    color: "#0ea5e9",
    description:
      language === "en"
        ? "Viewed at least one product"
        : language === "zh"
          ? "至少浏览了一个产品"
          : "Đã xem ít nhất một sản phẩm",
  },
  {
    stage: language === "en" ? "Add to Cart" : language === "zh" ? "加入购物车" : "Thêm vào giỏ",
    users: 2800,
    percentage: 28,
    dropOff: 37,
    icon: ShoppingCart,
    color: "#8b5cf6",
    description:
      language === "en" ? "Added items to cart" : language === "zh" ? "将商品加入购物车" : "Đã thêm sản phẩm vào giỏ",
  },
  {
    stage: language === "en" ? "Checkout" : language === "zh" ? "结账" : "Thanh toán",
    users: 1200,
    percentage: 12,
    dropOff: 16,
    icon: CreditCard,
    color: "#f59e0b",
    description:
      language === "en"
        ? "Started checkout process"
        : language === "zh"
          ? "开始结账流程"
          : "Bắt đầu quy trình thanh toán",
  },
  {
    stage: language === "en" ? "Purchase" : language === "zh" ? "购买" : "Mua hàng",
    users: 520,
    percentage: 5.2,
    dropOff: 6.8,
    icon: Download,
    color: "#ef4444",
    description: language === "en" ? "Completed purchase" : language === "zh" ? "完成购买" : "Hoàn thành mua hàng",
  },
]

export default function ConversionFunnel() {
  const { language } = useLanguage()
  const funnelData = getFunnelData(language)

  return (
    <Card className="border-[#d1e6d9]">
      <CardHeader>
        <CardTitle className="text-[#0e1a13]">
          {language === "en" ? "Conversion Funnel" : language === "zh" ? "转化漏斗" : "Phễu chuyển đổi"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelData.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-4 p-4 bg-[#f8fbfa] rounded-lg">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: stage.color }}
                >
                  <stage.icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-[#0e1a13]">{stage.stage}</h4>
                      <p className="text-sm text-[#51946b]">{stage.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#0e1a13]">{stage.users.toLocaleString()}</p>
                      <p className="text-sm text-[#51946b]">{stage.percentage}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={stage.percentage} className="h-3" />

                    {index > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600">
                          {language === "en"
                            ? "Conversion from previous"
                            : language === "zh"
                              ? "从上一步转化"
                              : "Chuyển đổi từ bước trước"}
                          :{((stage.percentage / funnelData[index - 1].percentage) * 100).toFixed(1)}%
                        </span>
                        <span className="text-red-600">
                          {language === "en" ? "Drop-off" : language === "zh" ? "流失" : "Rời bỏ"}: {stage.dropOff}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {index < funnelData.length - 1 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs">
                    -{funnelData[index + 1].dropOff}%
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-[#e8f2ec]">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0e1a13]">5.2%</p>
            <p className="text-sm text-[#51946b]">
              {language === "en"
                ? "Overall Conversion Rate"
                : language === "zh"
                  ? "总体转化率"
                  : "Tỷ lệ chuyển đổi tổng thể"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#0e1a13]">43.3%</p>
            <p className="text-sm text-[#51946b]">
              {language === "en"
                ? "Cart to Purchase Rate"
                : language === "zh"
                  ? "购物车到购买率"
                  : "Tỷ lệ từ giỏ hàng đến mua"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
