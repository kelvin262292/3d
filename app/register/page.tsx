"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function RegisterPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading, isAuthenticating, error, register, clearError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [validationErrors, setValidationErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Clear auth errors when component mounts or when user starts typing
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [formData.email, formData.password, formData.username])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...validationErrors }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = t.validation.username_required
      isValid = false
    } else if (formData.username.length < 3) {
      newErrors.username = t.validation.username_length
      isValid = false
    } else {
      newErrors.username = ""
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = t.validation.fullname_required
      isValid = false
    } else {
      newErrors.fullName = ""
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = t.validation.email_required
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t.validation.email_invalid
      isValid = false
    } else {
      newErrors.email = ""
    }

    // Phone validation
    const phoneRegex = /^\+?[0-9]{8,15}$/
    if (!formData.phone.trim()) {
      newErrors.phone = t.validation.phone_required
      isValid = false
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = t.validation.phone_invalid
      isValid = false
    } else {
      newErrors.phone = ""
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t.validation.password_required
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = t.validation.password_length
      isValid = false
    } else {
      newErrors.password = ""
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.validation.confirm_password_required
      isValid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.validation.passwords_not_match
      isValid = false
    } else {
      newErrors.confirmPassword = ""
    }

    // Terms agreement validation
    if (!agreeTerms) {
      newErrors.terms = t.validation.terms_required
      isValid = false
    } else {
      newErrors.terms = ""
    }

    setValidationErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.fullName
      })
      
      toast({
        title: t.auth.registration_successful,
        description: t.auth.registration_success_message,
      })
      
      // Redirect will be handled by useAuth hook
    } catch (authError: any) {
      // Error is already set in useAuth hook, just show toast
      toast({
        title: t.common.error,
        description: authError.message || t.auth.registration_error,
        variant: "destructive",
      })
    }
  }

  const getPlaceholder = (field: string) => {
    const placeholders = {
      username: {
        en: "Enter username",
        zh: "输入用户名",
        vi: "Nhập tên người dùng",
      },
      fullName: {
        en: "Enter your full name",
        zh: "输入您的全名",
        vi: "Nhập họ và tên của bạn",
      },
      email: {
        en: "Enter your email",
        zh: "输入您的邮箱",
        vi: "Nhập email của bạn",
      },
      phone: {
        en: "Enter your phone number",
        zh: "输入您的电话号码",
        vi: "Nhập số điện thoại của bạn",
      },
      password: {
        en: "Create a password",
        zh: "创建密码",
        vi: "Tạo mật khẩu",
      },
      confirmPassword: {
        en: "Confirm your password",
        zh: "确认您的密码",
        vi: "Xác nhận mật khẩu của bạn",
      },
    }

    return placeholders[field as keyof typeof placeholders][language as keyof typeof placeholders.username]
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-[#39e079] rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-[#0e1a13] rounded-sm transform rotate-12"></div>
            </div>
            <span className="font-bold text-2xl text-[#0e1a13]">3D Store</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#0e1a13] mb-2">{t.auth.create_account}</h1>
          <p className="text-[#51946b]">
            {language === "en"
              ? "Join our community of 3D creators and enthusiasts"
              : language === "zh"
                ? "加入我们的3D创作者和爱好者社区"
                : "Tham gia cộng đồng những người sáng tạo và yêu thích 3D của chúng tôi"}
          </p>
        </div>

        <Card className="border-[#d1e6d9]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} method="POST" className="space-y-4">
              {/* Auth Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message || t.auth.registration_error}
                    {error.field && (
                      <span className="block text-xs mt-1">
                        {t.validation[`${error.field}_error`] || `Error in ${error.field}`}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  {t.auth.username} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={getPlaceholder("username")}
                    className={`pl-10 ${
                      validationErrors.username ? "border-destructive" : ""
                    }`}
                    disabled={isAuthenticating || loading}
                  />
                </div>
                {validationErrors.username && <p className="text-sm text-destructive">{validationErrors.username}</p>}
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  {t.auth.full_name} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={getPlaceholder("fullName")}
                    className={`pl-10 ${
                      validationErrors.fullName ? "border-destructive" : ""
                    }`}
                    disabled={isAuthenticating || loading}
                  />
                </div>
                {validationErrors.fullName && <p className="text-sm text-destructive">{validationErrors.fullName}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0e1a13]">
                  {t.auth.email} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={getPlaceholder("email")}
                    disabled={isAuthenticating || loading}
                    className={`pl-10 border-[#d1e6d9] focus:border-[#39e079] ${validationErrors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#0e1a13]">
                  {t.auth.phone} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={getPlaceholder("phone")}
                    disabled={isAuthenticating || loading}
                    className={`pl-10 border-[#d1e6d9] focus:border-[#39e079] ${validationErrors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={getPlaceholder("password")}
                    disabled={isAuthenticating || loading}
                    className={`pl-10 pr-10 border-[#d1e6d9] focus:border-[#39e079] ${
                      validationErrors.password ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isAuthenticating || loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#0e1a13]">
                  {t.auth.confirm_password} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#51946b] w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={getPlaceholder("confirmPassword")}
                    disabled={isAuthenticating || loading}
                    className={`pl-10 pr-10 border-[#d1e6d9] focus:border-[#39e079] ${
                      validationErrors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isAuthenticating || loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {validationErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => {
                      setAgreeTerms(checked as boolean)
                      if (checked) setValidationErrors((prev) => ({ ...prev, terms: "" }))
                    }}
                    disabled={isAuthenticating || loading}
                    className={validationErrors.terms ? "border-red-500" : ""}
                  />
                  <Label htmlFor="terms" className="text-sm text-[#51946b] leading-tight">
                    {language === "en" ? (
                      <>
                        I agree to the{" "}
                        <Link href="/terms" className="text-[#39e079] hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-[#39e079] hover:underline">
                          Privacy Policy
                        </Link>
                      </>
                    ) : language === "zh" ? (
                      <>
                        我同意
                        <Link href="/terms" className="text-[#39e079] hover:underline">
                          服务条款
                        </Link>
                        和
                        <Link href="/privacy" className="text-[#39e079] hover:underline">
                          隐私政策
                        </Link>
                      </>
                    ) : (
                      <>
                        Tôi đồng ý với{" "}
                        <Link href="/terms" className="text-[#39e079] hover:underline">
                          Điều khoản Dịch vụ
                        </Link>{" "}
                        và{" "}
                        <Link href="/privacy" className="text-[#39e079] hover:underline">
                          Chính sách Bảo mật
                        </Link>
                      </>
                    )}
                  </Label>
                </div>
                {validationErrors.terms && <p className="text-red-500 text-sm mt-1">{validationErrors.terms}</p>}
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isAuthenticating || loading}
                className="w-full bg-[#39e079] text-[#0e1a13] hover:bg-[#39e079]/90 mt-2"
              >
                {isAuthenticating || loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-[#0e1a13] border-t-transparent rounded-full animate-spin mr-2" />
                    {t.common.loading}
                  </div>
                ) : (
                  <>
                    {t.auth.create_account}
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

            {/* Google Register */}
            <Button variant="outline" size="lg" disabled={isAuthenticating || loading} className="w-full border-[#d1e6d9] hover:bg-[#f8fbfa]">
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
              {t.auth.register_with_google}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-[#51946b]">
                {language === "en"
                  ? "Already have an account?"
                  : language === "zh"
                    ? "已经有账户？"
                    : "Đã có tài khoản?"}
              </span>{" "}
              <Link href="/login" className={`text-[#39e079] hover:text-[#39e079]/80 font-medium transition-colors ${isAuthenticating || loading ? 'pointer-events-none opacity-50' : ''}`}>
                {t.auth.login_title}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#39e079] mt-0.5" />
            <div>
              <h3 className="font-medium text-[#0e1a13]">
                {language === "en"
                  ? "Access to premium models"
                  : language === "zh"
                    ? "访问高级模型"
                    : "Truy cập các mô hình cao cấp"}
              </h3>
              <p className="text-sm text-[#51946b]">
                {language === "en"
                  ? "Get exclusive access to our premium 3D models collection"
                  : language === "zh"
                    ? "获得我们高级3D模型收藏的独家访问权"
                    : "Được quyền truy cập độc quyền vào bộ sưu tập mô hình 3D cao cấp của chúng tôi"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#39e079] mt-0.5" />
            <div>
              <h3 className="font-medium text-[#0e1a13]">
                {language === "en"
                  ? "Save your favorites"
                  : language === "zh"
                    ? "保存您的收藏"
                    : "Lưu mục yêu thích của bạn"}
              </h3>
              <p className="text-sm text-[#51946b]">
                {language === "en"
                  ? "Create collections and save your favorite 3D models"
                  : language === "zh"
                    ? "创建收藏夹并保存您喜爱的3D模型"
                    : "Tạo bộ sưu tập và lưu các mô hình 3D yêu thích của bạn"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#39e079] mt-0.5" />
            <div>
              <h3 className="font-medium text-[#0e1a13]">
                {language === "en" ? "Faster checkout" : language === "zh" ? "更快结账" : "Thanh toán nhanh hơn"}
              </h3>
              <p className="text-sm text-[#51946b]">
                {language === "en"
                  ? "Save your payment details for faster checkout"
                  : language === "zh"
                    ? "保存您的付款详情，以便更快结账"
                    : "Lưu thông tin thanh toán của bạn để thanh toán nhanh hơn"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
