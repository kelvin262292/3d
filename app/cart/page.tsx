"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/hooks/use-language"
import { formatCurrency } from "@/lib/i18n"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { language, t } = useLanguage()
  const { items: cartItems, loading, updateQuantity, removeFromCart, subtotal } = useCart()
  const { user } = useAuth()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(itemId)
    try {
      await updateQuantity(itemId, newQuantity)
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon({ code: couponCode, discount: 0.1 })
      setCouponCode("")
      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order",
      })
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid",
        variant: "destructive",
      })
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast({
      title: "Coupon removed",
      description: "Discount has been removed from your order",
    })
  }

  const couponDiscount = appliedCoupon ? subtotal * appliedCoupon.discount : 0
  const shipping = subtotal > 500000 ? 0 : 50000
  const tax = (subtotal - couponDiscount) * 0.1
  const total = subtotal - couponDiscount + shipping + tax

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#51946b]" />
          <p className="text-[#51946b]">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fbfa]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#e8f2ec] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#51946b]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0e1a13] mb-4">{t.cart.empty}</h1>
            <p className="text-[#51946b] mb-8">{t.cart.empty_desc}</p>
            <Button asChild size="lg" className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
              <Link href="/products">
                {t.cart.continue_shopping}
                <ArrowRight className="ml-2 w-5 h-5" />
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
          <h1 className="text-3xl font-bold text-[#0e1a13] mb-2">{t.cart.title}</h1>
          <p className="text-[#51946b]">
            {cartItems.length} {cartItems.length === 1 ? t.cart.item : t.cart.items}
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 {language === "en" ? "Sign in to save your cart and sync across devices" : 
                     language === "zh" ? "登录以保存购物车并在设备间同步" : 
                     "Đăng nhập để lưu giỏ hàng và đồng bộ trên các thiết bị"}
              </p>
              <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {language === "en" ? "Sign in now" : language === "zh" ? "立即登录" : "Đăng nhập ngay"}
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
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
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-[#51946b]">{item.product.category}</p>
                          <p className="text-xs text-[#51946b]">
                            {t.product.format}: {item.product.format || 'Digital'}
                          </p>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm line-through text-gray-400">
                                {formatCurrency(item.product.originalPrice, language)}
                              </span>
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                -{Math.round((1 - item.product.price / item.product.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating === item.id}
                            className="w-8 h-8 p-0"
                          >
                            {isUpdating === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Minus className="w-3 h-3" />
                            )}
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdating === item.id}
                            className="w-8 h-8 p-0"
                          >
                            {isUpdating === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-[#0e1a13]">
                            {formatCurrency(item.product.price * item.quantity, language)}
                          </div>
                          {item.product.originalPrice && (
                            <div className="text-sm text-[#51946b] line-through">
                              {formatCurrency(item.product.originalPrice * item.quantity, language)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Button asChild variant="outline" className="border-[#39e079] text-[#39e079]">
                <Link href="/products">{t.cart.continue_shopping}</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-[#d1e6d9] sticky top-6">
              <CardHeader>
                <CardTitle className="text-[#0e1a13]">
                  {language === "en" ? "Order Summary" : language === "zh" ? "订单摘要" : "Tóm tắt đơn hàng"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0e1a13]">{t.cart.coupon_code}</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
                        <span className="text-sm text-green-600">(-{(appliedCoupon.discount * 100).toFixed(0)}%)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder={
                          language === "en"
                            ? "Enter coupon code"
                            : language === "zh"
                              ? "输入优惠券代码"
                              : "Nhập mã giảm giá"
                        }
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="border-[#d1e6d9]"
                      />
                      <Button onClick={applyCoupon} variant="outline" className="border-[#39e079] text-[#39e079]">
                        {t.cart.apply_coupon}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#51946b]">{t.cart.subtotal}</span>
                    <span className="font-medium text-[#0e1a13]">{formatCurrency(subtotal, language)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        {language === "en" ? "Coupon Discount" : language === "zh" ? "优惠券折扣" : "Giảm giá coupon"} (
                        {appliedCoupon.code})
                      </span>
                      <span>-{formatCurrency(couponDiscount, language)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-[#51946b]">{t.cart.shipping}</span>
                    <span className="font-medium text-[#0e1a13]">
                      {shipping === 0
                        ? language === "en"
                          ? "Free"
                          : language === "zh"
                            ? "免费"
                            : "Miễn phí"
                        : formatCurrency(shipping, language)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#51946b]">{t.cart.tax}</span>
                    <span className="font-medium text-[#0e1a13]">{formatCurrency(tax, language)}</span>
                  </div>

                  {shipping === 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      {language === "en"
                        ? "🎉 You qualify for free shipping!"
                        : language === "zh"
                          ? "🎉 您符合免费送货条件！"
                          : "🎉 Bạn được miễn phí vận chuyển!"}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#0e1a13]">{t.cart.total}</span>
                  <span className="text-[#0e1a13]">{formatCurrency(total, language)}</span>
                </div>

                <Button asChild size="lg" className="w-full bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                  <Link href="/checkout">
                    {t.cart.checkout}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>

                {/* Security Notice */}
                <div className="text-xs text-[#51946b] text-center pt-2">
                  {language === "en"
                    ? "🔒 Secure checkout with SSL encryption"
                    : language === "zh"
                      ? "🔒 SSL加密安全结账"
                      : "🔒 Thanh toán bảo mật với mã hóa SSL"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
