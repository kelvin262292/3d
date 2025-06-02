"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/hooks/use-language"
import { formatCurrency } from "@/lib/i18n"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock checkout data
const getCheckoutData = (language: string) => ({
  items: [
    {
      id: "1",
      name: language === "en" ? "Modern Villa 3D" : language === "zh" ? "现代别墅3D" : "Villa Hiện Đại 3D",
      price: 299000,
      quantity: 2,
      image: "/modern-house.svg",
    },
    {
      id: "2",
      name: language === "en" ? "Ferrari Sports Car" : language === "zh" ? "法拉利跑车" : "Xe Thể Thao Ferrari",
      price: 450000,
      quantity: 1,
      image: "/sports-car.svg",
    },
  ],
  subtotal: 1048000,
  couponDiscount: 104800,
  shipping: 0,
  tax: 94320,
  total: 1037520,
})

export default function CheckoutPage() {
  const { language, t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Shipping Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Vietnam",
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const checkoutData = getCheckoutData(language)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      
      toast({
        title: language === "en" ? "Payment Successful!" : language === "zh" ? "支付成功！" : "Thanh toán thành công!",
        description: language === "en" 
          ? "Your order has been placed successfully. You will receive a confirmation email shortly."
          : language === "zh"
          ? "您的订单已成功下单。您将很快收到确认邮件。"
          : "Đơn hàng của bạn đã được đặt thành công. Bạn sẽ nhận được email xác nhận sớm.",
      })
      
      // Redirect to order confirmation
      router.push("/orders/12345")
    } catch (error) {
      toast({
        title: language === "en" ? "Payment Failed" : language === "zh" ? "支付失败" : "Thanh toán thất bại",
        description: language === "en" 
          ? "There was an error processing your payment. Please try again."
          : language === "zh"
          ? "处理您的付款时出现错误。请重试。"
          : "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getFieldLabel = (field: string) => {
    const labels = {
      firstName: language === "en" ? "First Name" : language === "zh" ? "名" : "Tên",
      lastName: language === "en" ? "Last Name" : language === "zh" ? "姓" : "Họ",
      email: language === "en" ? "Email Address" : language === "zh" ? "电子邮件地址" : "Địa chỉ Email",
      phone: language === "en" ? "Phone Number" : language === "zh" ? "电话号码" : "Số điện thoại",
      address: language === "en" ? "Street Address" : language === "zh" ? "街道地址" : "Địa chỉ",
      city: language === "en" ? "City" : language === "zh" ? "城市" : "Thành phố",
      state: language === "en" ? "State/Province" : language === "zh" ? "州/省" : "Tỉnh/Thành",
      zipCode: language === "en" ? "ZIP/Postal Code" : language === "zh" ? "邮政编码" : "Mã bưu điện",
      country: language === "en" ? "Country" : language === "zh" ? "国家" : "Quốc gia",
      cardNumber: language === "en" ? "Card Number" : language === "zh" ? "卡号" : "Số thẻ",
      expiryDate: language === "en" ? "Expiry Date" : language === "zh" ? "有效期" : "Ngày hết hạn",
      cvv: language === "en" ? "CVV" : language === "zh" ? "CVV" : "CVV",
      cardName: language === "en" ? "Name on Card" : language === "zh" ? "持卡人姓名" : "Tên trên thẻ",
    }
    return labels[field as keyof typeof labels] || field
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-[#51946b] hover:text-[#39e079] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "en" ? "Back to Cart" : language === "zh" ? "返回购物车" : "Quay lại giỏ hàng"}
          </Link>
          <h1 className="text-3xl font-bold text-[#0e1a13]">
            {language === "en" ? "Checkout" : language === "zh" ? "结账" : "Thanh toán"}
          </h1>
          <p className="text-[#51946b] mt-2">
            {language === "en" 
              ? "Complete your purchase securely"
              : language === "zh"
              ? "安全完成您的购买"
              : "Hoàn tất mua hàng an toàn"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0e1a13]">
                    {language === "en" ? "Billing Information" : language === "zh" ? "账单信息" : "Thông tin thanh toán"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{getFieldLabel("firstName")}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="border-[#d1e6d9]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{getFieldLabel("lastName")}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="border-[#d1e6d9]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{getFieldLabel("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="border-[#d1e6d9]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{getFieldLabel("phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="border-[#d1e6d9]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0e1a13]">
                    {language === "en" ? "Shipping Address" : language === "zh" ? "收货地址" : "Địa chỉ giao hàng"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">{getFieldLabel("address")}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                      className="border-[#d1e6d9]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">{getFieldLabel("city")}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                        className="border-[#d1e6d9]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">{getFieldLabel("state")}</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        required
                        className="border-[#d1e6d9]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">{getFieldLabel("zipCode")}</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        required
                        className="border-[#d1e6d9]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">{getFieldLabel("country")}</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        required
                        className="border-[#d1e6d9]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#0e1a13]">
                    {language === "en" ? "Payment Method" : language === "zh" ? "支付方式" : "Phương thức thanh toán"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border border-[#d1e6d9] rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="w-4 h-4" />
                        {language === "en" ? "Credit/Debit Card" : language === "zh" ? "信用卡/借记卡" : "Thẻ tín dụng/ghi nợ"}
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="cardNumber">{getFieldLabel("cardNumber")}</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          required
                          className="border-[#d1e6d9]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">{getFieldLabel("expiryDate")}</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            required
                            className="border-[#d1e6d9]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">{getFieldLabel("cvv")}</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            required
                            className="border-[#d1e6d9]"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">{getFieldLabel("cardName")}</Label>
                        <Input
                          id="cardName"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          required
                          className="border-[#d1e6d9]"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#0e1a13]">
                  {language === "en" ? "Order Summary" : language === "zh" ? "订单摘要" : "Tóm tắt đơn hàng"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {checkoutData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#e8f2ec] rounded-lg flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#0e1a13] text-sm">{item.name}</h4>
                        <p className="text-xs text-[#51946b]">
                          {language === "en" ? "Qty" : language === "zh" ? "数量" : "SL"}: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-[#0e1a13]">
                        {formatCurrency(item.price * item.quantity, language)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#51946b]">
                      {language === "en" ? "Subtotal" : language === "zh" ? "小计" : "Tạm tính"}
                    </span>
                    <span className="font-medium text-[#0e1a13]">
                      {formatCurrency(checkoutData.subtotal, language)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>
                      {language === "en" ? "Coupon Discount" : language === "zh" ? "优惠券折扣" : "Giảm giá coupon"}
                    </span>
                    <span>-{formatCurrency(checkoutData.couponDiscount, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#51946b]">
                      {language === "en" ? "Shipping" : language === "zh" ? "运费" : "Phí vận chuyển"}
                    </span>
                    <span className="font-medium text-[#0e1a13]">
                      {checkoutData.shipping === 0
                        ? language === "en"
                          ? "Free"
                          : language === "zh"
                          ? "免费"
                          : "Miễn phí"
                        : formatCurrency(checkoutData.shipping, language)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#51946b]">
                      {language === "en" ? "Tax" : language === "zh" ? "税费" : "Thuế"}
                    </span>
                    <span className="font-medium text-[#0e1a13]">
                      {formatCurrency(checkoutData.tax, language)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#0e1a13]">
                    {language === "en" ? "Total" : language === "zh" ? "总计" : "Tổng cộng"}
                  </span>
                  <span className="text-[#0e1a13]">{formatCurrency(checkoutData.total, language)}</span>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  size="lg"
                  className="w-full bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0e1a13] border-t-transparent rounded-full animate-spin mr-2" />
                      {language === "en" ? "Processing..." : language === "zh" ? "处理中..." : "Đang xử lý..."}
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      {language === "en" ? "Complete Order" : language === "zh" ? "完成订单" : "Hoàn tất đơn hàng"}
                    </>
                  )}
                </Button>

                {/* Security Features */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-xs text-[#51946b]">
                    <Shield className="w-3 h-3" />
                    {language === "en"
                      ? "SSL encrypted secure checkout"
                      : language === "zh"
                      ? "SSL加密安全结账"
                      : "Thanh toán bảo mật mã hóa SSL"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#51946b]">
                    <Truck className="w-3 h-3" />
                    {language === "en"
                      ? "Free shipping on orders over 500,000 VND"
                      : language === "zh"
                      ? "订单满500,000越南盾免运费"
                      : "Miễn phí vận chuyển cho đơn hàng trên 500,000 VND"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#51946b]">
                    <Check className="w-3 h-3" />
                    {language === "en"
                      ? "30-day money-back guarantee"
                      : language === "zh"
                      ? "30天退款保证"
                      : "Bảo đảm hoàn tiền trong 30 ngày"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}