"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, MapPin, Lock, Bell, LogOut } from "lucide-react"
import { logger } from '@/lib/logger'

interface AccountSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const { t } = useLanguage()

  const menuItems = [
    { id: "personal-info", label: t.auth.personal_info, icon: User },
    { id: "orders", label: t.auth.my_orders, icon: ShoppingBag },
    { id: "addresses", label: t.auth.addresses, icon: MapPin },
    { id: "change-password", label: t.auth.change_password, icon: Lock },
    { id: "notifications", label: t.auth.notifications, icon: Bell },
  ]

  const handleLogout = () => {
    // Implement logout functionality
    logger.info('User logout initiated', 'UI')
  }

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="justify-start w-full"
            onClick={() => onTabChange(item.id)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        )
      })}

      <hr className="my-4" />

      <Button
        variant="ghost"
        className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {t.auth.logout}
      </Button>
    </div>
  )
}
