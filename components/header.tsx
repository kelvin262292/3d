import Link from 'next/link';
import Image from 'next/image';
import { Menu as MenuIcon } from 'lucide-react';

// Thêm responsive cho header
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="/placeholder-logo.svg" 
                alt="Logo" 
                width={120} 
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Sản phẩm
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              Danh mục
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              Giới thiệu
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-700">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium">
            Sản phẩm
          </Link>
          <Link href="/categories" className="block px-3 py-2 rounded-md text-base font-medium">
            Danh mục
          </Link>
          <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium">
            Giới thiệu
          </Link>
        </div>
      </div>
    </header>
  )
}
