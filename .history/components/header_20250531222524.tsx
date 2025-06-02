"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "./language-switcher"
import Image from "next/image"
import NotificationCenter from "@/components/notifications/notification-center"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Category } from "@/types/api"
import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"

// API functions
async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch('/api/categories')
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return fallback categories when API fails
    return [
      { id: '1', name: 'Architecture', name_vi: 'Kiến trúc', slug: 'architecture', _count: { products: 25 } },
      { id: '2', name: 'Vehicles', name_vi: 'Xe cộ', slug: 'vehicles', _count: { products: 18 } },
      { id: '3', name: 'Characters', name_vi: 'Nhân vật', slug: 'characters', _count: { products: 32 } }
    ]
  }
}

function getCategoryDisplayName(category: Category, language: string): string {
  if (language === 'vi') {
    return category.name_vi || category.name || 'Danh mục'
  }
  return category.name || category.name_vi || 'Category'
}

export function Header() {
  const { language } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true)
      try {
        const data = await fetchCategories()
        setCategories(data.slice(0, 8)) // Chỉ hiển thị 8 danh mục đầu tiên
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])
  const router = useRouter()
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/placeholder-logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8" style={{width: 'auto', height: 'auto'}} />
          <span className="font-bold text-xl">My Store</span>
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-1">
                <span>{language === 'vi' ? 'Danh mục' : 'Categories'}</span>
                <ChevronDown className="w-4 h-4" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {isLoadingCategories ? (
                    <div className="col-span-2 text-center py-4">
                      <span className="text-gray-500">{language === 'vi' ? 'Đang tải...' : 'Loading...'}</span>
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <NavigationMenuLink key={category.id} asChild>
                        <Link
                          href={`/categories/${category.slug || category.id}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {getCategoryDisplayName(category, language)}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {category._count?.products || 0} {language === 'vi' ? 'sản phẩm' : 'products'}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-4">
                      <span className="text-gray-500">{language === 'vi' ? 'Không có danh mục' : 'No categories'}</span>
                    </div>
                  )}
                  <NavigationMenuLink asChild>
                    <Link
                      href="/categories"
                      className="col-span-2 block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-t mt-2 pt-3"
                      onClick={(e) => {
                        // Prevent event bubbling that might cause navigation issues
                        e.stopPropagation()
                      }}
                    >
                      <div className="text-sm font-medium leading-none text-center">
                        {language === 'vi' ? 'Xem tất cả danh mục' : 'View all categories'}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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
