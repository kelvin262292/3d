import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Noto_Sans } from "next/font/google"
import "../globals.css"
import Sidebar from '@/components/admin/Sidebar';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';


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
  title: "Admin Dashboard - 3D Model Store",
  description: "Quản lý cửa hàng mô hình 3D",
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <html lang="vi">
      <body className={`${plusJakartaSans.variable} ${notoSans.variable} font-sans antialiased`}>
        <ProtectedAdminRoute>
          <div className="flex h-screen bg-slate-900">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </ProtectedAdminRoute>
      </body>
    </html>
  );
};

export default AdminLayout;