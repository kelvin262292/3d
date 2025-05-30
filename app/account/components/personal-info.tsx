"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Save, X } from "lucide-react"

export default function PersonalInfo() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data - in a real app, this would come from your auth/user context
  const [userData, setUserData] = useState({
    username: "johndoe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [formData, setFormData] = useState({ ...userData })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your API
    setUserData({ ...formData })
    setIsEditing(false)
    toast({
      title: t.common.success,
      description: "Your profile has been updated successfully.",
    })
  }

  const handleCancel = () => {
    setFormData({ ...userData })
    setIsEditing(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{t.auth.personal_info}</h2>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            {t.common.edit}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              {t.common.cancel}
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              {t.common.save}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center mb-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center mb-4 md:mr-6 md:mb-0">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.fullName} />
            <AvatarFallback>{userData.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="link" size="sm">
              Change Avatar
            </Button>
          )}
        </div>

        <form className="w-full space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">{t.auth.username}</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">{t.auth.full_name}</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.auth.phone}</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="p-4 mt-6 border rounded-lg bg-slate-50">
        <h3 className="mb-2 font-medium">Account Information</h3>
        <p className="text-sm text-slate-500">
          Member since: January 15, 2023
          <br />
          Last login: Today at 10:45 AM
        </p>
      </div>
    </div>
  )
}
