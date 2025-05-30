"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: January 1, 2024",
      sections: [
        {
          title: "Acceptance of Terms",
          content:
            "By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        },
        {
          title: "Use License",
          content:
            "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.",
        },
        {
          title: "Disclaimer",
          content:
            "The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        },
        {
          title: "Limitations",
          content:
            "In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.",
        },
        {
          title: "Account Terms",
          content:
            "You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You are fully responsible for all activities that occur under your account and any other actions taken in connection with your account.",
        },
        {
          title: "Prohibited Uses",
          content:
            "You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws in your jurisdiction including but not limited to copyright laws.",
        },
        {
          title: "Termination",
          content:
            "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.",
        },
      ],
    },
    zh: {
      title: "服务条款",
      lastUpdated: "最后更新：2024年1月1日",
      sections: [
        {
          title: "接受条款",
          content:
            "通过访问和使用我们的网站和服务，您接受并同意受本协议条款和条件的约束。如果您不同意遵守上述条款，请不要使用此服务。",
        },
        {
          title: "使用许可",
          content:
            "我们授权您临时下载我们网站上材料的一份副本，仅供个人、非商业性临时查看。这是许可证的授予，而不是所有权的转让，在此许可证下，您不得修改或复制材料。",
        },
        {
          title: "免责声明",
          content:
            "我们网站上的材料按'现状'提供。我们不作任何明示或暗示的保证，并在此否认和否定所有其他保证，包括但不限于适销性、特定用途适用性或不侵犯知识产权或其他权利侵犯的暗示保证或条件。",
        },
        {
          title: "限制",
          content:
            "在任何情况下，我们公司或其供应商都不对因使用或无法使用我们网站上的材料而产生的任何损害（包括但不限于数据或利润损失或业务中断造成的损害）承担责任。",
        },
        {
          title: "账户条款",
          content:
            "您有责任保护密码并维护账户的机密性。您对在您账户下发生的所有活动以及与您账户相关的任何其他行为承担全部责任。",
        },
        {
          title: "禁止使用",
          content:
            "您不得将我们的产品用于任何非法或未经授权的目的，在使用服务时，您不得违反您所在司法管辖区的任何法律，包括但不限于版权法。",
        },
        {
          title: "终止",
          content:
            "我们可能会根据我们的独自判断，出于任何原因且不受限制，立即终止或暂停您的账户并禁止访问服务，无需事先通知或承担责任。",
        },
      ],
    },
    vi: {
      title: "Điều khoản Dịch vụ",
      lastUpdated: "Cập nhật lần cuối: 1 tháng 1, 2024",
      sections: [
        {
          title: "Chấp nhận Điều khoản",
          content:
            "Bằng cách truy cập và sử dụng trang web và dịch vụ của chúng tôi, bạn chấp nhận và đồng ý bị ràng buộc bởi các điều khoản và điều kiện của thỏa thuận này. Nếu bạn không đồng ý tuân thủ những điều trên, vui lòng không sử dụng dịch vụ này.",
        },
        {
          title: "Giấy phép Sử dụng",
          content:
            "Chúng tôi cấp phép tạm thời tải xuống một bản sao tài liệu trên trang web của chúng tôi chỉ để xem cá nhân, phi thương mại tạm thời. Đây là việc cấp giấy phép, không phải chuyển giao quyền sở hữu, và theo giấy phép này, bạn không được sửa đổi hoặc sao chép tài liệu.",
        },
        {
          title: "Tuyên bố Miễn trừ",
          content:
            "Các tài liệu trên trang web của chúng tôi được cung cấp trên cơ sở 'nguyên trạng'. Chúng tôi không đưa ra bảo đảm nào, rõ ràng hoặc ngụ ý, và từ chối và phủ nhận tất cả các bảo đảm khác bao gồm nhưng không giới hạn ở các bảo đảm ngụ ý về khả năng bán được, phù hợp cho mục đích cụ thể, hoặc không vi phạm sở hữu trí tuệ hoặc vi phạm quyền khác.",
        },
        {
          title: "Giới hạn",
          content:
            "Trong mọi trường hợp, công ty chúng tôi hoặc các nhà cung cấp của chúng tôi sẽ không chịu trách nhiệm về bất kỳ thiệt hại nào (bao gồm nhưng không giới hạn ở thiệt hại do mất dữ liệu hoặc lợi nhuận, hoặc do gián đoạn kinh doanh) phát sinh từ việc sử dụng hoặc không thể sử dụng tài liệu trên trang web của chúng tôi.",
        },
        {
          title: "Điều khoản Tài khoản",
          content:
            "Bạn có trách nhiệm bảo vệ mật khẩu và duy trì tính bảo mật của tài khoản. Bạn hoàn toàn chịu trách nhiệm về tất cả các hoạt động xảy ra dưới tài khoản của bạn và bất kỳ hành động nào khác được thực hiện liên quan đến tài khoản của bạn.",
        },
        {
          title: "Sử dụng Bị cấm",
          content:
            "Bạn không được sử dụng sản phẩm của chúng tôi cho bất kỳ mục đích bất hợp pháp hoặc không được ủy quyền nào, cũng như trong việc sử dụng dịch vụ, bạn không được vi phạm bất kỳ luật nào trong phạm vi quyền hạn của bạn bao gồm nhưng không giới hạn ở luật bản quyền.",
        },
        {
          title: "Chấm dứt",
          content:
            "Chúng tôi có thể chấm dứt hoặc tạm ngừng tài khoản của bạn và cấm truy cập vào dịch vụ ngay lập tức, mà không cần thông báo trước hoặc chịu trách nhiệm, theo quyết định riêng của chúng tôi, vì bất kỳ lý do gì và không giới hạn.",
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
              ? "Questions about our terms?"
              : language === "zh"
                ? "对我们的条款有疑问吗？"
                : "Có câu hỏi về điều khoản của chúng tôi?"}
          </p>
          <a href="/contact" className="text-[#39e079] hover:underline font-medium">
            {language === "en" ? "Contact us" : language === "zh" ? "联系我们" : "Liên hệ với chúng tôi"}
          </a>
        </div>
      </div>
    </div>
  )
}
