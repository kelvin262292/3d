"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"
import { Badge } from "@/components/ui/badge"

// Mock data cho contact info
const getContactInfo = (language: string) => [
  {
    icon: <Mail className="w-6 h-6" />,
    title: language === "en" ? "Email Us" : language === "zh" ? "邮件联系" : "Email cho chúng tôi",
    content: "support@3dstore.com",
    description:
      language === "en"
        ? "Send us an email anytime"
        : language === "zh"
          ? "随时给我们发邮件"
          : "Gửi email cho chúng tôi bất cứ lúc nào",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: language === "en" ? "Call Us" : language === "zh" ? "电话联系" : "Gọi cho chúng tôi",
    content: "+84 (0) 123 456 789",
    description:
      language === "en"
        ? "Mon-Fri from 8am to 5pm"
        : language === "zh"
          ? "周一至周五上午8点至下午5点"
          : "Thứ 2-6 từ 8h sáng đến 5h chiều",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: language === "en" ? "Visit Us" : language === "zh" ? "拜访我们" : "Thăm chúng tôi",
    content:
      language === "en"
        ? "123 Tech Street, District 1, Ho Chi Minh City"
        : language === "zh"
          ? "胡志明市第一区科技街123号"
          : "123 Đường Công nghệ, Quận 1, TP.HCM",
    description:
      language === "en"
        ? "Come say hello at our office"
        : language === "zh"
          ? "来我们办公室打个招呼"
          : "Đến chào hỏi tại văn phòng của chúng tôi",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: language === "en" ? "Working Hours" : language === "zh" ? "工作时间" : "Giờ làm việc",
    content:
      language === "en"
        ? "Monday - Friday: 8:00 AM - 5:00 PM"
        : language === "zh"
          ? "周一至周五：上午8:00 - 下午5:00"
          : "Thứ 2 - Thứ 6: 8:00 - 17:00",
    description:
      language === "en" ? "Weekend support available" : language === "zh" ? "周末支持可用" : "Hỗ trợ cuối tuần có sẵn",
  },
]

// Mock data cho FAQ
const getFAQs = (language: string) => [
  {
    question:
      language === "en"
        ? "How do I download purchased models?"
        : language === "zh"
          ? "如何下载购买的模型？"
          : "Làm thế nào để tải xuống mô hình đã mua?",
    answer:
      language === "en"
        ? "After purchase, you'll receive an email with download links. You can also access your downloads from your account dashboard."
        : language === "zh"
          ? "购买后，您将收到包含下载链接的电子邮件。您也可以从账户仪表板访问下载。"
          : "Sau khi mua, bạn sẽ nhận được email với liên kết tải xuống. Bạn cũng có thể truy cập tải xuống từ bảng điều khiển tài khoản.",
  },
  {
    question:
      language === "en"
        ? "What file formats do you support?"
        : language === "zh"
          ? "您支持哪些文件格式？"
          : "Bạn hỗ trợ những định dạng file nào?",
    answer:
      language === "en"
        ? "We support all major 3D formats including FBX, OBJ, BLEND, MAX, 3DS, and DAE. Each model page shows available formats."
        : language === "zh"
          ? "我们支持所有主要的3D格式，包括FBX、OBJ、BLEND、MAX、3DS和DAE。每个模型页面都显示可用格式。"
          : "Chúng tôi hỗ trợ tất cả các định dạng 3D chính bao gồm FBX, OBJ, BLEND, MAX, 3DS và DAE. Mỗi trang mô hình hiển thị các định dạng có sẵn.",
  },
  {
    question:
      language === "en"
        ? "Can I use models for commercial projects?"
        : language === "zh"
          ? "我可以将模型用于商业项目吗？"
          : "Tôi có thể sử dụng mô hình cho dự án thương mại không?",
    answer:
      language === "en"
        ? "Yes! Our standard license allows commercial use. Check each model's license details for specific terms."
        : language === "zh"
          ? "是的！我们的标准许可证允许商业使用。请查看每个模型的许可证详细信息以了解具体条款。"
          : "Có! Giấy phép tiêu chuẩn của chúng tôi cho phép sử dụng thương mại. Kiểm tra chi tiết giấy phép của từng mô hình để biết các điều khoản cụ thể.",
  },
  {
    question:
      language === "en"
        ? "Do you offer refunds?"
        : language === "zh"
          ? "您提供退款吗？"
          : "Bạn có cung cấp hoàn tiền không?",
    answer:
      language === "en"
        ? "We offer a 30-day money-back guarantee if you're not satisfied with your purchase. Contact support for assistance."
        : language === "zh"
          ? "如果您对购买不满意，我们提供30天退款保证。请联系支持寻求帮助。"
          : "Chúng tôi cung cấp bảo đảm hoàn tiền 30 ngày nếu bạn không hài lòng với việc mua hàng. Liên hệ hỗ trợ để được trợ giúp.",
  },
  {
    question:
      language === "en"
        ? "How can I become a seller?"
        : language === "zh"
          ? "我如何成为卖家？"
          : "Làm thế nào để trở thành người bán?",
    answer:
      language === "en"
        ? "Join our creator program by applying through our website. We review all applications and provide onboarding support for approved artists."
        : language === "zh"
          ? "通过我们的网站申请加入我们的创作者计划。我们审查所有申请，并为获批的艺术家提供入职支持。"
          : "Tham gia chương trình nhà sáng tạo của chúng tôi bằng cách đăng ký qua website. Chúng tôi xem xét tất cả đơn đăng ký và cung cấp hỗ trợ định hướng cho các nghệ sĩ được chấp thuận.",
  },
]

// Mock data cho support categories
const getSupportCategories = (language: string) => [
  {
    id: "general",
    name: language === "en" ? "General Inquiry" : language === "zh" ? "一般咨询" : "Câu hỏi chung",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    id: "technical",
    name: language === "en" ? "Technical Support" : language === "zh" ? "技术支持" : "Hỗ trợ kỹ thuật",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    id: "billing",
    name: language === "en" ? "Billing & Payment" : language === "zh" ? "账单和付款" : "Thanh toán & Hóa đơn",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    id: "partnership",
    name: language === "en" ? "Partnership" : language === "zh" ? "合作伙伴关系" : "Đối tác",
    icon: <Users className="w-5 h-5" />,
  },
]

export default function ContactPage() {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = getContactInfo(language)
  const faqs = getFAQs(language)
  const supportCategories = getSupportCategories(language)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#e8f2ec] to-[#f8fbfa] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0e1a13] mb-6">
              {language === "en" ? "Get in Touch" : language === "zh" ? "联系我们" : "Liên hệ với chúng tôi"}
            </h1>
            <p className="text-xl text-[#51946b] mb-8 max-w-3xl mx-auto">
              {language === "en"
                ? "Have questions about our 3D models or need support? We're here to help! Reach out to us through any of the channels below."
                : language === "zh"
                  ? "对我们的3D模型有疑问或需要支持？我们在这里帮助您！通过以下任何渠道联系我们。"
                  : "Có câu hỏi về mô hình 3D của chúng tôi hoặc cần hỗ trợ? Chúng tôi ở đây để giúp đỡ! Liên hệ với chúng tôi qua bất kỳ kênh nào dưới đây."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-[#d1e6d9] text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#e8f2ec] rounded-full flex items-center justify-center mx-auto mb-4 text-[#39e079]">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-[#0e1a13] mb-2">{info.title}</h3>
                  <p className="font-medium text-[#0e1a13] mb-2">{info.content}</p>
                  <p className="text-sm text-[#51946b]">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-[#d1e6d9]">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#0e1a13]">
                    {language === "en"
                      ? "Send us a Message"
                      : language === "zh"
                        ? "给我们留言"
                        : "Gửi tin nhắn cho chúng tôi"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">
                        {language === "en"
                          ? "Message Sent!"
                          : language === "zh"
                            ? "消息已发送！"
                            : "Tin nhắn đã được gửi!"}
                      </h3>
                      <p className="text-[#51946b]">
                        {language === "en"
                          ? "Thank you for contacting us. We'll get back to you within 24 hours."
                          : language === "zh"
                            ? "感谢您联系我们。我们将在24小时内回复您。"
                            : "Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong vòng 24 giờ."}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#0e1a13]">
                          {language === "en" ? "Full Name" : language === "zh" ? "全名" : "Họ và tên"} *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder={
                            language === "en"
                              ? "Enter your full name"
                              : language === "zh"
                                ? "输入您的全名"
                                : "Nhập họ và tên của bạn"
                          }
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="border-[#d1e6d9] focus:border-[#39e079]"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#0e1a13]">
                          {language === "en" ? "Email Address" : language === "zh" ? "邮箱地址" : "Địa chỉ Email"} *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={
                            language === "en"
                              ? "Enter your email address"
                              : language === "zh"
                                ? "输入您的邮箱地址"
                                : "Nhập địa chỉ email của bạn"
                          }
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="border-[#d1e6d9] focus:border-[#39e079]"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-[#0e1a13]">
                          {language === "en" ? "Category" : language === "zh" ? "类别" : "Danh mục"} *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger className="border-[#d1e6d9] focus:border-[#39e079]">
                            <SelectValue
                              placeholder={
                                language === "en"
                                  ? "Select a category"
                                  : language === "zh"
                                    ? "选择类别"
                                    : "Chọn danh mục"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {supportCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center">
                                  {category.icon}
                                  <span className="ml-2">{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-[#0e1a13]">
                          {language === "en" ? "Subject" : language === "zh" ? "主题" : "Chủ đề"} *
                        </Label>
                        <Input
                          id="subject"
                          type="text"
                          placeholder={
                            language === "en"
                              ? "Enter message subject"
                              : language === "zh"
                                ? "输入消息主题"
                                : "Nhập chủ đề tin nhắn"
                          }
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className="border-[#d1e6d9] focus:border-[#39e079]"
                          required
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-[#0e1a13]">
                          {language === "en" ? "Message" : language === "zh" ? "消息" : "Tin nhắn"} *
                        </Label>
                        <Textarea
                          id="message"
                          placeholder={
                            language === "en"
                              ? "Tell us how we can help you..."
                              : language === "zh"
                                ? "告诉我们如何帮助您..."
                                : "Cho chúng tôi biết làm thế nào chúng tôi có thể giúp bạn..."
                          }
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="border-[#d1e6d9] focus:border-[#39e079] min-h-[120px]"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-[#0e1a13] border-t-transparent rounded-full animate-spin mr-2" />
                            {language === "en" ? "Sending..." : language === "zh" ? "发送中..." : "Đang gửi..."}
                          </div>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            {language === "en" ? "Send Message" : language === "zh" ? "发送消息" : "Gửi tin nhắn"}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold text-[#0e1a13] mb-6">
                {language === "en"
                  ? "Frequently Asked Questions"
                  : language === "zh"
                    ? "常见问题"
                    : "Câu hỏi thường gặp"}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-[#d1e6d9]">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-[#0e1a13] mb-3">{faq.question}</h3>
                      <p className="text-[#51946b]">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Support */}
              <Card className="border-[#d1e6d9] mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#0e1a13] mb-3">
                    {language === "en"
                      ? "Need More Help?"
                      : language === "zh"
                        ? "需要更多帮助？"
                        : "Cần thêm trợ giúp?"}
                  </h3>
                  <p className="text-[#51946b] mb-4">
                    {language === "en"
                      ? "Check out our comprehensive help center for detailed guides and tutorials."
                      : language === "zh"
                        ? "查看我们的综合帮助中心，获取详细指南和教程。"
                        : "Xem trung tâm trợ giúp toàn diện của chúng tôi để có hướng dẫn và hướng dẫn chi tiết."}
                  </p>
                  <Button variant="outline" className="border-[#39e079] text-[#39e079]">
                    {language === "en"
                      ? "Visit Help Center"
                      : language === "zh"
                        ? "访问帮助中心"
                        : "Truy cập Trung tâm Trợ giúp"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0e1a13] mb-6 text-center">
            {language === "en" ? "Find Us" : language === "zh" ? "找到我们" : "Tìm chúng tôi"}
          </h2>
          <Card className="border-[#d1e6d9] overflow-hidden">
            <div className="relative w-full h-96 bg-[#e8f2ec] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#39e079] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0e1a13] mb-2">
                  {language === "en"
                    ? "Our Office Location"
                    : language === "zh"
                      ? "我们的办公地点"
                      : "Vị trí văn phòng"}
                </h3>
                <p className="text-[#51946b]">
                  {language === "en"
                    ? "123 Tech Street, District 1, Ho Chi Minh City"
                    : language === "zh"
                      ? "胡志明市第一区科技街123号"
                      : "123 Đường Công nghệ, Quận 1, TP.HCM"}
                </p>
                <Badge className="mt-4 bg-[#39e079] text-[#0e1a13]">
                  {language === "en"
                    ? "Interactive Map Coming Soon"
                    : language === "zh"
                      ? "交互式地图即将推出"
                      : "Bản đồ tương tác sắp ra mắt"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 bg-[#0e1a13]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            {language === "en" ? "Business Hours" : language === "zh" ? "营业时间" : "Giờ làm việc"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-4">
                {language === "en" ? "Office Hours" : language === "zh" ? "办公时间" : "Giờ văn phòng"}
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  {language === "en" ? "Monday - Friday" : language === "zh" ? "周一至周五" : "Thứ 2 - Thứ 6"}: 8:00 AM
                  - 5:00 PM
                </p>
                <p>{language === "en" ? "Saturday" : language === "zh" ? "周六" : "Thứ 7"}: 9:00 AM - 1:00 PM</p>
                <p>
                  {language === "en" ? "Sunday" : language === "zh" ? "周日" : "Chủ nhật"}:{" "}
                  {language === "en" ? "Closed" : language === "zh" ? "关闭" : "Đóng cửa"}
                </p>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-xl font-semibold mb-4">
                {language === "en" ? "Support Hours" : language === "zh" ? "支持时间" : "Giờ hỗ trợ"}
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>{language === "en" ? "Email Support" : language === "zh" ? "邮件支持" : "Hỗ trợ Email"}: 24/7</p>
                <p>
                  {language === "en" ? "Live Chat" : language === "zh" ? "在线聊天" : "Chat trực tiếp"}: 8:00 AM - 10:00
                  PM
                </p>
                <p>
                  {language === "en" ? "Phone Support" : language === "zh" ? "电话支持" : "Hỗ trợ điện thoại"}: 8:00 AM
                  - 5:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
