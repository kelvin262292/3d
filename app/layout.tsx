import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Noto_Sans } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { LanguageProvider } from "@/hooks/use-language"
import { Footer } from "@/components/footer"

import { AuthProvider } from "@/hooks/useAuth"
import { CartProvider } from "@/hooks/useCart"
import { WishlistProvider } from "@/hooks/useWishlist"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-plus-jakarta",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  title: "3D Model Store - Cửa hàng mô hình 3D chất lượng cao",
  description: "Khám phá bộ sưu tập mô hình 3D đa dạng với chất lượng cao. Giao hàng nhanh, giá cả hợp lý.",
  keywords: "mô hình 3D, 3D models, kiến trúc, xe hơi, nhân vật, 3d store",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${plusJakartaSans.variable} ${notoSans.variable} font-sans antialiased`}>

        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LanguageProvider>
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </LanguageProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
