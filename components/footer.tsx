"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/hooks/use-language"
import { LanguageSwitcher } from "./language-switcher"

export function Footer() {
  const { language, t } = useLanguage()

  const footerLinks = {
    company: {
      title: language === "en" ? "Company" : language === "zh" ? "公司" : "Công ty",
      links: [
        { name: t.header.about, href: "/about" },
        { name: language === "en" ? "Careers" : language === "zh" ? "招聘" : "Tuyển dụng", href: "/careers" },
        { name: language === "en" ? "Press" : language === "zh" ? "新闻" : "Báo chí", href: "/press" },
        { name: language === "en" ? "Blog" : language === "zh" ? "博客" : "Blog", href: "/blog" },
        { name: language === "en" ? "Investors" : language === "zh" ? "投资者" : "Nhà đầu tư", href: "/investors" },
      ],
    },
    support: {
      title: language === "en" ? "Support" : language === "zh" ? "支持" : "Hỗ trợ",
      links: [
        { name: t.header.contact, href: "/contact" },
        {
          name: language === "en" ? "Help Center" : language === "zh" ? "帮助中心" : "Trung tâm trợ giúp",
          href: "/help",
        },
        { name: language === "en" ? "Downloads" : language === "zh" ? "下载" : "Tải xuống", href: "/downloads" },
        {
          name: language === "en" ? "System Status" : language === "zh" ? "系统状态" : "Trạng thái hệ thống",
          href: "/status",
        },
        { name: language === "en" ? "Bug Reports" : language === "zh" ? "错误报告" : "Báo lỗi", href: "/bugs" },
      ],
    },
    legal: {
      title: language === "en" ? "Legal" : language === "zh" ? "法律" : "Pháp lý",
      links: [
        {
          name: language === "en" ? "Privacy Policy" : language === "zh" ? "隐私政策" : "Chính sách bảo mật",
          href: "/privacy",
        },
        {
          name: language === "en" ? "Terms of Service" : language === "zh" ? "服务条款" : "Điều khoản dịch vụ",
          href: "/terms",
        },
        {
          name: language === "en" ? "Cookie Policy" : language === "zh" ? "Cookie政策" : "Chính sách Cookie",
          href: "/cookies",
        },
        { name: language === "en" ? "Licensing" : language === "zh" ? "许可证" : "Giấy phép", href: "/licensing" },
        { name: language === "en" ? "DMCA" : language === "zh" ? "DMCA" : "DMCA", href: "/dmca" },
      ],
    },
    resources: {
      title: language === "en" ? "Resources" : language === "zh" ? "资源" : "Tài nguyên",
      links: [
        {
          name: language === "en" ? "API Documentation" : language === "zh" ? "API文档" : "Tài liệu API",
          href: "/api-docs",
        },
        { name: language === "en" ? "Tutorials" : language === "zh" ? "教程" : "Hướng dẫn", href: "/tutorials" },
        { name: language === "en" ? "Community" : language === "zh" ? "社区" : "Cộng đồng", href: "/community" },
        {
          name: language === "en" ? "Developer Tools" : language === "zh" ? "开发工具" : "Công cụ phát triển",
          href: "/dev-tools",
        },
        {
          name: language === "en" ? "Affiliate Program" : language === "zh" ? "联盟计划" : "Chương trình đối tác",
          href: "/affiliate",
        },
      ],
    },
  }

  return (
    <footer className="bg-[#0e1a13] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#39e079] rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-[#0e1a13] rounded-sm transform rotate-12"></div>
              </div>
              <span className="font-bold text-xl">{t.header.logo}</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === "en"
                ? "Your premier destination for high-quality 3D models. From architecture to characters, we provide professional-grade assets for creators worldwide."
                : language === "zh"
                  ? "您的高品质3D模型首选目的地。从建筑到角色，我们为全球创作者提供专业级资产。"
                  : "Điểm đến hàng đầu cho các mô hình 3D chất lượng cao. Từ kiến trúc đến nhân vật, chúng tôi cung cấp tài sản chuyên nghiệp cho các nhà sáng tạo trên toàn thế giới."}
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold">
                {language === "en" ? "Stay Updated" : language === "zh" ? "保持更新" : "Cập nhật thông tin"}
              </h4>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    language === "en" ? "Enter your email" : language === "zh" ? "输入您的邮箱" : "Nhập email của bạn"
                  }
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
                <Button className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                  {language === "en" ? "Subscribe" : language === "zh" ? "订阅" : "Đăng ký"}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-300 hover:text-[#39e079] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39e079]/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#39e079]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">support@3dstore.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39e079]/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#39e079]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {language === "en" ? "Phone" : language === "zh" ? "电话" : "Điện thoại"}
              </p>
              <p className="text-white">+84 123 456 789</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39e079]/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#39e079]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {language === "en" ? "Address" : language === "zh" ? "地址" : "Địa chỉ"}
              </p>
              <p className="text-white">
                {language === "en"
                  ? "123 Tech Street, Ho Chi Minh City"
                  : language === "zh"
                    ? "胡志明市科技街123号"
                    : "123 Đường Công Nghệ, TP.HCM"}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#39e079]" />
            <div>
              <p className="font-semibold">
                {language === "en" ? "Secure Payments" : language === "zh" ? "安全支付" : "Thanh toán bảo mật"}
              </p>
              <p className="text-sm text-gray-400">
                {language === "en"
                  ? "SSL encrypted transactions"
                  : language === "zh"
                    ? "SSL加密交易"
                    : "Giao dịch mã hóa SSL"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-[#39e079]" />
            <div>
              <p className="font-semibold">
                {language === "en" ? "Instant Download" : language === "zh" ? "即时下载" : "Tải xuống ngay lập tức"}
              </p>
              <p className="text-sm text-gray-400">
                {language === "en"
                  ? "Access your files immediately"
                  : language === "zh"
                    ? "立即访问您的文件"
                    : "Truy cập file ngay lập tức"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#39e079]" />
            <div>
              <p className="font-semibold">
                {language === "en" ? "Money Back Guarantee" : language === "zh" ? "退款保证" : "Đảm bảo hoàn tiền"}
              </p>
              <p className="text-sm text-gray-400">
                {language === "en"
                  ? "30-day return policy"
                  : language === "zh"
                    ? "30天退货政策"
                    : "Chính sách đổi trả 30 ngày"}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 {t.header.logo}.{" "}
              {language === "en"
                ? "All rights reserved."
                : language === "zh"
                  ? "版权所有。"
                  : "Tất cả quyền được bảo lưu."}
            </p>
            <LanguageSwitcher />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-[#39e079] transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#39e079] transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#39e079] transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#39e079] transition-colors">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
