"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = t.validation.email_required
      isValid = false
    } else if (!emailRegex.test(email)) {
      newErrors.email = t.validation.email_invalid
      isValid = false
    }

    // Password validation
    if (!password) {
      newErrors.password = t.validation.password_required
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: t.auth.login_successful,
        description: t.auth.welcome_back,
        variant: "success",
      })

      // Redirect to home page after successful login
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.auth.login_error,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-[#39e079] rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-[#0e1a13] rounded-sm transform rotate-12"></div>
            </div>
            <span className="font-bold text-2xl text-[#0e1a13]">3D Store</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#0e1a13] mb-2">{t.auth.login_title}</h1>
          <p className="text-[#51946b]">
            {language === "en"
              ? "Welcome back! Please sign in to your account"
              : language === "zh"
                ? "欢迎回来！请登录您的账户"
                : "Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn"}
          </p>
        </div>

        <Card className="border-[#d1e6d9]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0e1a13]">
                  {t.auth.email} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      language === "en" ? "Enter your email" : language === "zh" ? "输入您的邮箱" : "Nhập email của bạn"
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                    }}
                    className={`pl-10 border-[#d1e6d9] focus:border-[#39e079] ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0e1a13]">
                  {t.auth.password} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      language === "en"
                        ? "Enter your password"
                        : language === "zh"
                          ? "输入您的密码"
                          : "Nhập mật khẩu của bạn"
                    }
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                    }}
                    className={`pl-10 pr-10 border-[#d1e6d9] focus:border-[#39e079] ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                  <Label htmlFor="remember" className="text-sm text-[#51946b]">
                    {t.auth.remember_me}
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#39e079] hover:text-[#39e079]/80 transition-colors"
                >
                  {t.auth.forgot_password}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-[#0e1a13] border-t-transparent rounded-full animate-spin mr-2" />
                    {t.common.loading}
                  </div>
                ) : (
                  <>
                    {t.auth.login_title}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-[#51946b]">
                {t.auth.or}
              </span>
            </div>

            {/* Google Login */}
            <Button variant="outline" size="lg" className="w-full border-[#d1e6d9] hover:bg-[#f8fbfa]">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t.auth.login_with_google}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-[#51946b]">
                {language === "en"
                  ? "Don't have an account?"
                  : language === "zh"
                    ? "还没有账户？"
                    : "Chưa có tài khoản?"}
              </span>{" "}
              <Link href="/register" className="text-[#39e079] hover:text-[#39e079]/80 font-medium transition-colors">
                {t.auth.create_account}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[#51946b]">
          {language === "en"
            ? "By signing in, you agree to our Terms of Service and Privacy Policy"
            : language === "zh"
              ? "登录即表示您同意我们的服务条款和隐私政策"
              : "Bằng cách đăng nhập, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi"}
        </div>
      </div>
    </div>
  )
}
