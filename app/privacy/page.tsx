"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: January 1, 2024",
      sections: [
        {
          title: "Information We Collect",
          content:
            "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, payment information, and communication preferences.",
        },
        {
          title: "How We Use Your Information",
          content:
            "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers.",
        },
        {
          title: "Information Sharing",
          content:
            "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our website and conducting our business.",
        },
        {
          title: "Data Security",
          content:
            "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
        },
        {
          title: "Your Rights",
          content:
            "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. To exercise these rights, please contact us using the information provided below.",
        },
        {
          title: "Contact Us",
          content:
            "If you have any questions about this Privacy Policy, please contact us at privacy@3dstore.com or through our contact page.",
        },
      ],
    },
    zh: {
      title: "隐私政策",
      lastUpdated: "最后更新：2024年1月1日",
      sections: [
        {
          title: "我们收集的信息",
          content:
            "我们收集您直接提供给我们的信息，例如当您创建账户、购买商品或联系我们寻求支持时。这可能包括您的姓名、电子邮件地址、付款信息和通信偏好。",
        },
        {
          title: "我们如何使用您的信息",
          content:
            "我们使用收集的信息来提供、维护和改进我们的服务，处理交易，向您发送技术通知和支持消息，并与您就产品、服务和促销优惠进行沟通。",
        },
        {
          title: "信息共享",
          content:
            "除本政策所述情况外，我们不会在未经您同意的情况下出售、交易或以其他方式将您的个人信息转让给第三方。我们可能会与协助我们运营网站和开展业务的可信服务提供商共享您的信息。",
        },
        {
          title: "数据安全",
          content:
            "我们实施适当的安全措施来保护您的个人信息免受未经授权的访问、更改、披露或销毁。但是，通过互联网传输的方法都不是100%安全的。",
        },
        {
          title: "您的权利",
          content:
            "您有权访问、更新或删除您的个人信息。您也可以选择不接收我们的某些通信。要行使这些权利，请使用下面提供的信息联系我们。",
        },
        {
          title: "联系我们",
          content: "如果您对本隐私政策有任何疑问，请通过privacy@3dstore.com或我们的联系页面与我们联系。",
        },
      ],
    },
    vi: {
      title: "Chính sách Bảo mật",
      lastUpdated: "Cập nhật lần cuối: 1 tháng 1, 2024",
      sections: [
        {
          title: "Thông tin chúng tôi thu thập",
          content:
            "Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, mua hàng hoặc liên hệ với chúng tôi để được hỗ trợ. Điều này có thể bao gồm tên, địa chỉ email, thông tin thanh toán và tùy chọn liên lạc của bạn.",
        },
        {
          title: "Cách chúng tôi sử dụng thông tin của bạn",
          content:
            "Chúng tôi sử dụng thông tin thu thập được để cung cấp, duy trì và cải thiện dịch vụ của mình, xử lý giao dịch, gửi cho bạn các thông báo kỹ thuật và tin nhắn hỗ trợ, và liên lạc với bạn về sản phẩm, dịch vụ và ưu đãi khuyến mại.",
        },
        {
          title: "Chia sẻ thông tin",
          content:
            "Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, trừ khi được mô tả trong chính sách này. Chúng tôi có thể chia sẻ thông tin của bạn với các nhà cung cấp dịch vụ đáng tin cậy hỗ trợ chúng tôi vận hành trang web và điều hành kinh doanh.",
        },
        {
          title: "Bảo mật dữ liệu",
          content:
            "Chúng tôi thực hiện các biện pháp bảo mật thích hợp để bảo vệ thông tin cá nhân của bạn khỏi việc truy cập, thay đổi, tiết lộ hoặc phá hủy trái phép. Tuy nhiên, không có phương pháp truyền tải qua internet nào là 100% an toàn.",
        },
        {
          title: "Quyền của bạn",
          content:
            "Bạn có quyền truy cập, cập nhật hoặc xóa thông tin cá nhân của mình. Bạn cũng có thể từ chối nhận một số thông tin liên lạc từ chúng tôi. Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi bằng thông tin được cung cấp bên dưới.",
        },
        {
          title: "Liên hệ với chúng tôi",
          content:
            "Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi tại privacy@3dstore.com hoặc thông qua trang liên hệ của chúng tôi.",
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0e1a13] mb-4">{currentContent.title}</h1>
          <p className="text-[#51946b]">{currentContent.lastUpdated}</p>
        </div>

        <div className="space-y-6">
          {currentContent.sections.map((section, index) => (
            <Card key={index} className="border-[#d1e6d9]">
              <CardHeader>
                <CardTitle className="text-[#0e1a13]">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#51946b] leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-[#51946b] mb-4">
            {language === "en"
              ? "Have questions about our privacy practices?"
              : language === "zh"
                ? "对我们的隐私做法有疑问吗？"
                : "Có câu hỏi về thực hành bảo mật của chúng tôi?"}
          </p>
          <a href="/contact" className="text-[#39e079] hover:underline font-medium">
            {language === "en" ? "Contact us" : language === "zh" ? "联系我们" : "Liên hệ với chúng tôi"}
          </a>
        </div>
      </div>
    </div>
  )
}
