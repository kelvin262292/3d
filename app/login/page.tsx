"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
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

export default function LoginPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading, isAuthenticating, error, login, clearError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Clear auth errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, password, clearError])

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...validationErrors }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = t.validation.email_required
      isValid = false
    } else if (!emailRegex.test(email)) {
      newErrors.email = t.validation.email_invalid
      isValid = false
    } else {
      newErrors.email = ""
    }

    // Password validation
    if (!password) {
      newErrors.password = t.validation.password_required
      isValid = false
    } else {
      newErrors.password = ""
    }

    setValidationErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await login(email, password, rememberMe)
      
      toast({
        title: t.auth.login_successful,
        description: t.auth.welcome_back,
      })
      
      // Redirect will be handled by useAuth hook
    } catch (authError: any) {
      // Error is already set in useAuth hook, just show toast
      toast({
        title: t.common.error,
        description: authError.message || t.auth.login_error,
        variant: "destructive",
      })
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
            {t.auth.welcome_back}
          </p>
        </div>

        <Card className="border-[#d1e6d9]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Auth Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message || t.auth.login_error}
                    {error.field && (
                      <span className="block text-xs mt-1">
                        {t.validation[`${error.field}_error`] || `Error in ${error.field}`}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}

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
                    placeholder={t.auth.email}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: "" }))
                    }}
                    className={`pl-10 border-[#d1e6d9] focus:border-[#39e079] ${validationErrors.email ? "border-red-500" : ""}`}
                    disabled={isAuthenticating || loading}
                  />
                </div>
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
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
                    placeholder={t.auth.password}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: "" }))
                    }}
                    className={`pl-10 pr-10 border-[#d1e6d9] focus:border-[#39e079] ${validationErrors.password ? "border-red-500" : ""}`}
                    disabled={isAuthenticating || loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isAuthenticating || loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#51946b]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#51946b]" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isAuthenticating || loading}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    {t.auth.remember_me}
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className={`text-sm text-primary hover:underline ${
                    isAuthenticating || loading ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  {t.auth.forgot_password}
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isAuthenticating || loading || !email.trim() || !password}
                className="w-full bg-[#39e079] hover:bg-[#39e079]/90 text-white font-medium py-3 transition-colors"
              >
                {isAuthenticating ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    {
                      language === "en" ? "Signing in..." : language === "zh" ? "登录中..." : "Đang đăng nhập..."
                    }
                  </div>
                ) : (
                  <div className="flex items-center">
                    {t.auth.login_title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
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
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-[#d1e6d9] hover:bg-[#f8fbfa]"
              disabled={isAuthenticating || loading}
              onClick={() => {
                toast({
                  title: t.common.coming_soon,
                  description: t.auth.google_login_coming_soon,
                })
              }}
            >
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
                {t.auth.dont_have_account}
              </span>{" "}
              <Link 
                href="/register" 
                className={`text-[#39e079] hover:text-[#39e079]/80 font-medium transition-colors ${
                  isAuthenticating || loading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
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
