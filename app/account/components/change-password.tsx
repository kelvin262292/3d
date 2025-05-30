"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

export default function ChangePassword() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Password strength requirements
  const requirements = [
    {
      id: "length",
      label: "At least 8 characters",
      validator: (password: string) => password.length >= 8,
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter",
      validator: (password: string) => /[a-z]/.test(password),
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter",
      validator: (password: string) => /[A-Z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number",
      validator: (password: string) => /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character",
      validator: (password: string) => /[^A-Za-z0-9]/.test(password),
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear confirm password error when new password changes
    if (name === "newPassword" && errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else {
      // Check if new password meets all requirements
      const failedRequirements = requirements.filter((req) => !req.validator(formData.newPassword))
      if (failedRequirements.length > 0) {
        newErrors.newPassword = "Password does not meet all requirements"
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: t.common.success,
        description: "Your password has been changed successfully.",
      })
    }, 1500)
  }

  // Check if new password meets each requirement
  const checkRequirement = (requirement: (typeof requirements)[0]) => {
    if (!formData.newPassword) return null
    return requirement.validator(formData.newPassword)
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">{t.auth.change_password}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={errors.currentPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleInputChange}
              className={errors.newPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}

          {/* Password requirements */}
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">Password requirements:</p>
            <ul className="space-y-1">
              {requirements.map((requirement) => {
                const isValid = checkRequirement(requirement)
                return (
                  <li
                    key={requirement.id}
                    className={`flex items-center text-sm ${
                      isValid === null ? "text-gray-500" : isValid ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isValid === null ? (
                      <span className="w-4 h-4 mr-2" />
                    ) : isValid ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                    {requirement.label}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-gray-500" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </Button>
      </form>

      <div className="p-4 mt-6 border rounded-lg bg-blue-50 text-blue-800">
        <h3 className="flex items-center mb-2 font-medium">
          <AlertCircle className="w-4 h-4 mr-2" />
          Security Tip
        </h3>
        <p className="text-sm">
          For maximum security, use a unique password that you don't use for other websites. Consider using a password
          manager to generate and store strong passwords.
        </p>
      </div>
    </div>
  )
}
