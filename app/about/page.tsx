"use client"

import Image from "next/image"
import { Users, Target, Award, Heart, Zap, Shield, Globe, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import Link from "next/link"

// Mock data cho team members
const getTeamMembers = (language: string) => [
  {
    id: 1,
    name: "Nguyễn Văn An",
    role: language === "en" ? "CEO & Founder" : language === "zh" ? "首席执行官兼创始人" : "CEO & Người sáng lập",
    bio:
      language === "en"
        ? "10+ years experience in 3D modeling and digital art. Passionate about bringing creativity to life through technology."
        : language === "zh"
          ? "拥有10多年3D建模和数字艺术经验。热衷于通过技术将创意变为现实。"
          : "Hơn 10 năm kinh nghiệm trong lĩnh vực mô hình 3D và nghệ thuật số. Đam mê mang sự sáng tạo vào cuộc sống thông qua công nghệ.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "an@3dstore.com",
    },
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    role: language === "en" ? "Head of Design" : language === "zh" ? "设计总监" : "Trưởng phòng Thiết kế",
    bio:
      language === "en"
        ? "Award-winning 3D artist with expertise in architectural visualization and character modeling."
        : language === "zh"
          ? "屡获殊荣的3D艺术家，专长于建筑可视化和角色建模。"
          : "Nghệ sĩ 3D từng đoạt giải thưởng với chuyên môn về trực quan hóa kiến trúc và mô hình nhân vật.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      linkedin: "#",
      behance: "#",
      email: "binh@3dstore.com",
    },
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    role: language === "en" ? "Technical Director" : language === "zh" ? "技术总监" : "Giám đốc Kỹ thuật",
    bio:
      language === "en"
        ? "Full-stack developer specializing in 3D web technologies and real-time rendering solutions."
        : language === "zh"
          ? "全栈开发者，专注于3D网络技术和实时渲染解决方案。"
          : "Lập trình viên full-stack chuyên về công nghệ web 3D và giải pháp render thời gian thực.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      github: "#",
      linkedin: "#",
      email: "cuong@3dstore.com",
    },
  },
  {
    id: 4,
    name: "Phạm Thu Hà",
    role: language === "en" ? "Community Manager" : language === "zh" ? "社区经理" : "Quản lý Cộng đồng",
    bio:
      language === "en"
        ? "Building bridges between creators and customers. Expert in digital marketing and community engagement."
        : language === "zh"
          ? "在创作者和客户之间架起桥梁。数字营销和社区参与专家。"
          : "Xây dựng cầu nối giữa các nhà sáng tạo và khách hàng. Chuyên gia về marketing số và tương tác cộng đồng.",
    image: "/placeholder.svg?height=300&width=300",
    social: {
      facebook: "#",
      instagram: "#",
      email: "ha@3dstore.com",
    },
  },
]

// Mock data cho company stats
const getCompanyStats = (language: string) => [
  {
    number: "10,000+",
    label: language === "en" ? "3D Models" : language === "zh" ? "3D模型" : "Mô hình 3D",
    icon: <Globe className="w-8 h-8" />,
  },
  {
    number: "50,000+",
    label: language === "en" ? "Happy Customers" : language === "zh" ? "满意客户" : "Khách hàng hài lòng",
    icon: <Users className="w-8 h-8" />,
  },
  {
    number: "500+",
    label: language === "en" ? "Artists" : language === "zh" ? "艺术家" : "Nghệ sĩ",
    icon: <Award className="w-8 h-8" />,
  },
  {
    number: "99.9%",
    label: language === "en" ? "Uptime" : language === "zh" ? "正常运行时间" : "Thời gian hoạt động",
    icon: <TrendingUp className="w-8 h-8" />,
  },
]

// Mock data cho company values
const getCompanyValues = (language: string) => [
  {
    icon: <Heart className="w-12 h-12" />,
    title: language === "en" ? "Passion for Quality" : language === "zh" ? "对质量的热情" : "Đam mê Chất lượng",
    description:
      language === "en"
        ? "We believe every 3D model should meet the highest standards of quality and craftsmanship."
        : language === "zh"
          ? "我们相信每个3D模型都应该达到最高的质量和工艺标准。"
          : "Chúng tôi tin rằng mọi mô hình 3D đều phải đạt tiêu chuẩn chất lượng và tay nghề cao nhất.",
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: language === "en" ? "Innovation First" : language === "zh" ? "创新第一" : "Đổi mới Đầu tiên",
    description:
      language === "en"
        ? "We constantly push the boundaries of what's possible in 3D modeling and digital art."
        : language === "zh"
          ? "我们不断推动3D建模和数字艺术可能性的边界。"
          : "Chúng tôi liên tục đẩy lùi ranh giới của những gì có thể trong mô hình 3D và nghệ thuật số.",
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: language === "en" ? "Trust & Security" : language === "zh" ? "信任与安全" : "Tin cậy & Bảo mật",
    description:
      language === "en"
        ? "Your data and transactions are protected with enterprise-grade security measures."
        : language === "zh"
          ? "您的数据和交易受到企业级安全措施的保护。"
          : "Dữ liệu và giao dịch của bạn được bảo vệ bằng các biện pháp bảo mật cấp doanh nghiệp.",
  },
  {
    icon: <Users className="w-12 h-12" />,
    title: language === "en" ? "Community Driven" : language === "zh" ? "社区驱动" : "Cộng đồng Dẫn dắt",
    description:
      language === "en"
        ? "Our platform is built by creators, for creators. Every feature is designed with our community in mind."
        : language === "zh"
          ? "我们的平台由创作者为创作者而建。每个功能都是为我们的社区而设计的。"
          : "Nền tảng của chúng tôi được xây dựng bởi các nhà sáng tạo, cho các nhà sáng tạo. Mọi tính năng đều được thiết kế với cộng đồng trong tâm trí.",
  },
]

export default function AboutPage() {
  const { language, t } = useLanguage()

  const teamMembers = getTeamMembers(language)
  const companyStats = getCompanyStats(language)
  const companyValues = getCompanyValues(language)

  return (
    <div className="min-h-screen bg-[#f8fbfa]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#e8f2ec] to-[#f8fbfa] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0e1a13] mb-6">
              {language === "en" ? "About 3D Store" : language === "zh" ? "关于3D商店" : "Giới thiệu 3D Store"}
            </h1>
            <p className="text-xl text-[#51946b] mb-8 max-w-3xl mx-auto">
              {language === "en"
                ? "We're passionate about democratizing 3D content creation. Our mission is to provide creators worldwide with access to high-quality 3D models that bring their visions to life."
                : language === "zh"
                  ? "我们热衷于3D内容创作的民主化。我们的使命是为全世界的创作者提供高质量的3D模型，让他们的愿景成为现实。"
                  : "Chúng tôi đam mê việc dân chủ hóa việc tạo nội dung 3D. Sứ mệnh của chúng tôi là cung cấp cho các nhà sáng tạo trên toàn thế giới quyền truy cập vào các mô hình 3D chất lượng cao để hiện thực hóa tầm nhìn của họ."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
                <Link href="/products">
                  {language === "en" ? "Explore Models" : language === "zh" ? "探索模型" : "Khám phá Mô hình"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#39e079] text-[#39e079]">
                <Link href="/contact">
                  {language === "en" ? "Get in Touch" : language === "zh" ? "联系我们" : "Liên hệ"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#e8f2ec] rounded-full flex items-center justify-center mx-auto mb-4 text-[#39e079]">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-[#0e1a13] mb-2">{stat.number}</div>
                <div className="text-[#51946b]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0e1a13] mb-6">
                {language === "en" ? "Our Story" : language === "zh" ? "我们的故事" : "Câu chuyện của chúng tôi"}
              </h2>
              <div className="space-y-4 text-[#51946b]">
                <p>
                  {language === "en"
                    ? "Founded in 2020 by a team of passionate 3D artists and developers, 3D Store began as a simple idea: make high-quality 3D models accessible to everyone. What started as a small collection of architectural models has grown into one of the world's largest marketplaces for 3D content."
                    : language === "zh"
                      ? "3D商店成立于2020年，由一群充满激情的3D艺术家和开发者创立，始于一个简单的想法：让每个人都能获得高质量的3D模型。从一个小型建筑模型收藏开始，现在已发展成为世界上最大的3D内容市场之一。"
                      : "Được thành lập vào năm 2020 bởi một nhóm các nghệ sĩ 3D và lập trình viên đầy đam mê, 3D Store bắt đầu từ một ý tưởng đơn giản: làm cho các mô hình 3D chất lượng cao có thể tiếp cận được với mọi người. Từ một bộ sưu tập nhỏ các mô hình kiến trúc, chúng tôi đã phát triển thành một trong những thị trường lớn nhất thế giới cho nội dung 3D."}
                </p>
                <p>
                  {language === "en"
                    ? "Today, we serve over 50,000 creators worldwide, from indie game developers to major film studios. Our platform hosts more than 10,000 carefully curated 3D models across dozens of categories, all created by talented artists from around the globe."
                    : language === "zh"
                      ? "如今，我们为全球超过50,000名创作者提供服务，从独立游戏开发者到大型电影工作室。我们的平台拥有超过10,000个精心策划的3D模型，涵盖数十个类别，全部由来自世界各地的才华横溢的艺术家创作。"
                      : "Ngày nay, chúng tôi phục vụ hơn 50.000 nhà sáng tạo trên toàn thế giới, từ các nhà phát triển game độc lập đến các studio phim lớn. Nền tảng của chúng tôi lưu trữ hơn 10.000 mô hình 3D được tuyển chọn cẩn thận trong hàng chục danh mục, tất cả được tạo ra bởi các nghệ sĩ tài năng từ khắp nơi trên thế giới."}
                </p>
                <p>
                  {language === "en"
                    ? "We believe that great 3D content should be accessible, affordable, and inspiring. That's why we work tirelessly to maintain the highest quality standards while keeping our prices fair for creators at every level."
                    : language === "zh"
                      ? "我们相信优秀的3D内容应该是可获得的、负担得起的和鼓舞人心的。这就是为什么我们不懈努力保持最高质量标准，同时为各个级别的创作者保持公平的价格。"
                      : "Chúng tôi tin rằng nội dung 3D tuyệt vời phải có thể tiếp cận được, giá cả phải chăng và truyền cảm hứng. Đó là lý do tại sao chúng tôi làm việc không mệt mỏi để duy trì các tiêu chuẩn chất lượng cao nhất trong khi giữ giá cả công bằng cho các nhà sáng tạo ở mọi cấp độ."}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 overflow-hidden rounded-xl">
                <Image src="/placeholder.svg?height=400&width=600" alt="Our Story" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#39e079] rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#39e079] rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0e1a13] mb-4">
              {language === "en" ? "Our Values" : language === "zh" ? "我们的价值观" : "Giá trị của chúng tôi"}
            </h2>
            <p className="text-[#51946b] max-w-2xl mx-auto">
              {language === "en"
                ? "These core values guide everything we do and shape the way we build our platform and serve our community."
                : language === "zh"
                  ? "这些核心价值观指导着我们所做的一切，并塑造了我们构建平台和服务社区的方式。"
                  : "Những giá trị cốt lõi này hướng dẫn mọi việc chúng tôi làm và định hình cách chúng tôi xây dựng nền tảng và phục vụ cộng đồng."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="border-[#d1e6d9] text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-20 h-20 bg-[#e8f2ec] rounded-full flex items-center justify-center mx-auto mb-6 text-[#39e079]">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-[#0e1a13] mb-4">{value.title}</h3>
                  <p className="text-[#51946b] text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0e1a13] mb-4">
              {language === "en" ? "Meet Our Team" : language === "zh" ? "认识我们的团队" : "Gặp gỡ Đội ngũ"}
            </h2>
            <p className="text-[#51946b] max-w-2xl mx-auto">
              {language === "en"
                ? "Behind every great platform is a passionate team. Meet the people who make 3D Store possible."
                : language === "zh"
                  ? "每个伟大平台的背后都有一个充满激情的团队。认识让3D商店成为可能的人们。"
                  : "Đằng sau mỗi nền tảng tuyệt vời là một đội ngũ đầy đam mê. Gặp gỡ những người làm cho 3D Store trở thành hiện thực."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="border-[#d1e6d9] hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-semibold text-[#0e1a13] mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="bg-[#e8f2ec] text-[#39e079] mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-[#51946b] mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="text-[#51946b] hover:text-[#39e079] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="text-[#51946b] hover:text-[#39e079] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-[#51946b] hover:text-[#39e079] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-[#0e1a13]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="text-white">
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-[#39e079] mr-3" />
                <h2 className="text-3xl font-bold">
                  {language === "en" ? "Our Mission" : language === "zh" ? "我们的使命" : "Sứ mệnh"}
                </h2>
              </div>
              <p className="text-gray-300 text-lg">
                {language === "en"
                  ? "To democratize 3D content creation by providing creators worldwide with access to high-quality, affordable 3D models that inspire and enable extraordinary digital experiences."
                  : language === "zh"
                    ? "通过为全世界的创作者提供高质量、负担得起的3D模型，民主化3D内容创作，激发并实现非凡的数字体验。"
                    : "Dân chủ hóa việc tạo nội dung 3D bằng cách cung cấp cho các nhà sáng tạo trên toàn thế giới quyền truy cập vào các mô hình 3D chất lượng cao, giá cả phải chăng để truyền cảm hứng và tạo ra những trải nghiệm số phi thường."}
              </p>
            </div>
            <div className="text-white">
              <div className="flex items-center mb-4">
                <Award className="w-8 h-8 text-[#39e079] mr-3" />
                <h2 className="text-3xl font-bold">
                  {language === "en" ? "Our Vision" : language === "zh" ? "我们的愿景" : "Tầm nhìn"}
                </h2>
              </div>
              <p className="text-gray-300 text-lg">
                {language === "en"
                  ? "To become the world's leading marketplace for 3D content, fostering a global community where creativity knows no bounds and every creator has the tools they need to bring their imagination to life."
                  : language === "zh"
                    ? "成为世界领先的3D内容市场，培育一个创造力无界限的全球社区，每个创作者都拥有将想象力变为现实所需的工具。"
                    : "Trở thành thị trường hàng đầu thế giới về nội dung 3D, nuôi dưỡng một cộng đồng toàn cầu nơi sự sáng tạo không có giới hạn và mọi nhà sáng tạo đều có những công cụ cần thiết để biến trí tưởng tượng thành hiện thực."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#e8f2ec] to-[#f8fbfa]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0e1a13] mb-4">
            {language === "en"
              ? "Ready to Join Our Community?"
              : language === "zh"
                ? "准备加入我们的社区了吗？"
                : "Sẵn sàng tham gia Cộng đồng?"}
          </h2>
          <p className="text-[#51946b] mb-8 text-lg">
            {language === "en"
              ? "Whether you're a creator looking to share your work or someone seeking the perfect 3D model, we'd love to have you as part of our growing community."
              : language === "zh"
                ? "无论您是希望分享作品的创作者，还是寻找完美3D模型的人，我们都很乐意您成为我们不断发展的社区的一部分。"
                : "Dù bạn là nhà sáng tạo muốn chia sẻ tác phẩm hay người đang tìm kiếm mô hình 3D hoàn hảo, chúng tôi rất mong bạn trở thành một phần của cộng đồng đang phát triển."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90">
              <Link href="/register">
                {language === "en"
                  ? "Join as Creator"
                  : language === "zh"
                    ? "作为创作者加入"
                    : "Tham gia với tư cách Nhà sáng tạo"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-[#39e079] text-[#39e079]">
              <Link href="/products">
                {language === "en" ? "Browse Models" : language === "zh" ? "浏览模型" : "Duyệt Mô hình"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
