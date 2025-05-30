"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useLanguage } from "@/hooks/use-language"

export default function HelpPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]))
  }

  const helpContent = {
    en: {
      title: "Help Center",
      subtitle: "Find answers to your questions",
      searchPlaceholder: "Search for help...",
      categories: [
        {
          id: "getting-started",
          title: "Getting Started",
          icon: "🚀",
          questions: [
            {
              question: "How do I create an account?",
              answer:
                "Click the 'Register' button in the top right corner, fill in your details, and verify your email address.",
            },
            {
              question: "How do I download purchased models?",
              answer:
                "After purchase, go to your account dashboard and click on 'My Downloads' to access all your purchased 3D models.",
            },
            {
              question: "What file formats are supported?",
              answer:
                "We support FBX, OBJ, BLEND, 3DS, DAE, and STL formats. Each product page shows the available formats.",
            },
          ],
        },
        {
          id: "payments",
          title: "Payments & Billing",
          icon: "💳",
          questions: [
            {
              question: "What payment methods do you accept?",
              answer:
                "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.",
            },
            {
              question: "Can I get a refund?",
              answer:
                "Yes, we offer a 30-day money-back guarantee. Contact our support team if you're not satisfied with your purchase.",
            },
            {
              question: "How do I update my billing information?",
              answer: "Go to your account settings and click on 'Billing Information' to update your payment details.",
            },
          ],
        },
        {
          id: "technical",
          title: "Technical Support",
          icon: "🔧",
          questions: [
            {
              question: "The model won't open in my software",
              answer:
                "Make sure you're using compatible software and the correct file format. Check our compatibility guide for more information.",
            },
            {
              question: "How do I report a bug?",
              answer:
                "Use our bug report form or email us at bugs@3dstore.com with detailed information about the issue.",
            },
            {
              question: "Can I request custom modifications?",
              answer:
                "Yes, we offer custom modification services. Contact our team with your requirements for a quote.",
            },
          ],
        },
      ],
      contactOptions: [
        {
          title: "Live Chat",
          description: "Chat with our support team",
          icon: MessageCircle,
          action: "Start Chat",
        },
        {
          title: "Email Support",
          description: "Get help via email",
          icon: Mail,
          action: "Send Email",
        },
        {
          title: "Phone Support",
          description: "Call us directly",
          icon: Phone,
          action: "Call Now",
        },
      ],
    },
    zh: {
      title: "帮助中心",
      subtitle: "找到您问题的答案",
      searchPlaceholder: "搜索帮助...",
      categories: [
        {
          id: "getting-started",
          title: "入门指南",
          icon: "🚀",
          questions: [
            {
              question: "如何创建账户？",
              answer: '点击右上角的"注册"按钮，填写您的详细信息，并验证您的电子邮件地址。',
            },
            {
              question: "如何下载购买的模型？",
              answer: '购买后，转到您的账户仪表板，点击"我的下载"以访问所有购买的3D模型。',
            },
            {
              question: "支持哪些文件格式？",
              answer: "我们支持FBX、OBJ、BLEND、3DS、DAE和STL格式。每个产品页面都显示可用格式。",
            },
          ],
        },
        {
          id: "payments",
          title: "付款和账单",
          icon: "💳",
          questions: [
            {
              question: "您接受哪些付款方式？",
              answer: "我们接受所有主要信用卡、PayPal和银行转账。所有付款都经过安全处理。",
            },
            {
              question: "我可以退款吗？",
              answer: "是的，我们提供30天退款保证。如果您对购买不满意，请联系我们的支持团队。",
            },
            {
              question: "如何更新我的账单信息？",
              answer: '转到您的账户设置，点击"账单信息"以更新您的付款详细信息。',
            },
          ],
        },
        {
          id: "technical",
          title: "技术支持",
          icon: "🔧",
          questions: [
            {
              question: "模型无法在我的软件中打开",
              answer: "确保您使用兼容的软件和正确的文件格式。查看我们的兼容性指南以获取更多信息。",
            },
            {
              question: "如何报告错误？",
              answer: "使用我们的错误报告表单或发送电子邮件至bugs@3dstore.com，并提供有关问题的详细信息。",
            },
            {
              question: "我可以请求自定义修改吗？",
              answer: "是的，我们提供自定义修改服务。请联系我们的团队，提供您的要求以获取报价。",
            },
          ],
        },
      ],
      contactOptions: [
        {
          title: "在线聊天",
          description: "与我们的支持团队聊天",
          icon: MessageCircle,
          action: "开始聊天",
        },
        {
          title: "邮件支持",
          description: "通过邮件获得帮助",
          icon: Mail,
          action: "发送邮件",
        },
        {
          title: "电话支持",
          description: "直接致电我们",
          icon: Phone,
          action: "立即致电",
        },
      ],
    },
    vi: {
      title: "Trung tâm Trợ giúp",
      subtitle: "Tìm câu trả lời cho câu hỏi của bạn",
      searchPlaceholder: "Tìm kiếm trợ giúp...",
      categories: [
        {
          id: "getting-started",
          title: "Bắt đầu",
          icon: "🚀",
          questions: [
            {
              question: "Làm thế nào để tạo tài khoản?",
              answer:
                "Nhấp vào nút 'Đăng ký' ở góc trên bên phải, điền thông tin chi tiết và xác minh địa chỉ email của bạn.",
            },
            {
              question: "Làm thế nào để tải xuống mô hình đã mua?",
              answer:
                "Sau khi mua, vào bảng điều khiển tài khoản và nhấp vào 'Tải xuống của tôi' để truy cập tất cả mô hình 3D đã mua.",
            },
            {
              question: "Những định dạng file nào được hỗ trợ?",
              answer:
                "Chúng tôi hỗ trợ các định dạng FBX, OBJ, BLEND, 3DS, DAE và STL. Mỗi trang sản phẩm hiển thị các định dạng có sẵn.",
            },
          ],
        },
        {
          id: "payments",
          title: "Thanh toán & Hóa đơn",
          icon: "💳",
          questions: [
            {
              question: "Bạn chấp nhận những phương thức thanh toán nào?",
              answer:
                "Chúng tôi chấp nhận tất cả các thẻ tín dụng chính, PayPal và chuyển khoản ngân hàng. Tất cả thanh toán được xử lý an toàn.",
            },
            {
              question: "Tôi có thể được hoàn tiền không?",
              answer:
                "Có, chúng tôi cung cấp bảo đảm hoàn tiền trong 30 ngày. Liên hệ với đội hỗ trợ nếu bạn không hài lòng với giao dịch mua.",
            },
            {
              question: "Làm thế nào để cập nhật thông tin thanh toán?",
              answer:
                "Vào cài đặt tài khoản và nhấp vào 'Thông tin Thanh toán' để cập nhật chi tiết thanh toán của bạn.",
            },
          ],
        },
        {
          id: "technical",
          title: "Hỗ trợ Kỹ thuật",
          icon: "🔧",
          questions: [
            {
              question: "Mô hình không mở được trong phần mềm của tôi",
              answer:
                "Đảm bảo bạn đang sử dụng phần mềm tương thích và định dạng file đúng. Kiểm tra hướng dẫn tương thích để biết thêm thông tin.",
            },
            {
              question: "Làm thế nào để báo cáo lỗi?",
              answer:
                "Sử dụng biểu mẫu báo cáo lỗi hoặc email cho chúng tôi tại bugs@3dstore.com với thông tin chi tiết về vấn đề.",
            },
            {
              question: "Tôi có thể yêu cầu chỉnh sửa tùy chỉnh không?",
              answer:
                "Có, chúng tôi cung cấp dịch vụ chỉnh sửa tùy chỉnh. Liên hệ với đội của chúng tôi với yêu cầu của bạn để được báo giá.",
            },
          ],
        },
      ],
      contactOptions: [
        {
          title: "Chat Trực tiếp",
          description: "Trò chuyện với đội hỗ trợ",
          icon: MessageCircle,
          action: "Bắt đầu Chat",
        },
        {
          title: "Hỗ trợ Email",
          description: "Nhận trợ giúp qua email",
          icon: Mail,
          action: "Gửi Email",
        },
        {
          title: "Hỗ trợ Điện thoại",
          description: "Gọi trực tiếp cho chúng tôi",
          icon: Phone,
          action: "Gọi Ngay",
        },
      ],
    },
  }

  const currentContent = helpContent[language]

  const filteredCategories = currentContent.categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          searchQuery === "" ||
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0e1a13] mb-4">{currentContent.title}</h1>
          <p className="text-xl text-[#51946b] mb-8">{currentContent.subtitle}</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
            <Input
              placeholder={currentContent.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#d1e6d9] h-12 text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6 mb-12">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="border-[#d1e6d9]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[#0e1a13]">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.questions.map((qa, index) => (
                  <Collapsible
                    key={index}
                    open={openSections.includes(`${category.id}-${index}`)}
                    onOpenChange={() => toggleSection(`${category.id}-${index}`)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-[#f8fbfa] hover:bg-[#e8f2ec] rounded-lg transition-colors">
                      <span className="font-medium text-[#0e1a13]">{qa.question}</span>
                      {openSections.includes(`${category.id}-${index}`) ? (
                        <ChevronDown className="w-5 h-5 text-[#51946b]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#51946b]" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 py-3">
                      <p className="text-[#51946b] leading-relaxed">{qa.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Options */}
        <Card className="border-[#d1e6d9]">
          <CardHeader>
            <CardTitle className="text-center text-[#0e1a13]">
              {language === "en" ? "Still need help?" : language === "zh" ? "仍需要帮助？" : "Vẫn cần trợ giúp?"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentContent.contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-[#f8fbfa] rounded-lg hover:bg-[#e8f2ec] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#39e079] rounded-full flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-[#0e1a13]" />
                  </div>
                  <h3 className="font-semibold text-[#0e1a13] mb-2">{option.title}</h3>
                  <p className="text-[#51946b] mb-4">{option.description}</p>
                  <Button className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">{option.action}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#51946b] mb-4">
              {language === "en"
                ? "No results found for your search"
                : language === "zh"
                  ? "未找到搜索结果"
                  : "Không tìm thấy kết quả cho tìm kiếm của bạn"}
            </p>
            <Button onClick={() => setSearchQuery("")} variant="outline" className="border-[#39e079] text-[#39e079]">
              {language === "en" ? "Clear Search" : language === "zh" ? "清除搜索" : "Xóa tìm kiếm"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
