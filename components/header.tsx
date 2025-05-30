"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "./language-switcher"
import Image from "next/image"
import NotificationCenter from "@/components/notifications/notification-center"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"

export function Header() {
  const router = useRouter()
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="font-bold text-xl">My Store</span>
        </Link>

        {/* Search Bar */}
        <div className="flex items-center border rounded-md px-3 py-1 focus-within:border-blue-500 w-full max-w-sm">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input type="text" placeholder="Search products..." className="ml-2 w-full border-none focus:ring-0" />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notification Center */}
          <NotificationCenter userId="user-123" />

          {/* Search Button - Mobile */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => router.push("/search")}>
            <Search className="w-5 h-5" />
          </Button>
          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-gray-900" />
            <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-xs rounded-full px-2 py-0 shadow-md">
              3
            </span>
          </Link>
          {/* Authentication Links (Placeholder) */}
          <Link href="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
          <Link href="/register" className="text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}
