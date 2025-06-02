# Mock Data Audit Report

## Tổng quan
Đây là danh sách chi tiết tất cả các mock data được tìm thấy trong codebase, được phân loại theo mức độ ưu tiên và loại.

## Phân loại Mock Data

### 🔴 Cao - Cần thay thế ngay lập tức (Core Business Logic)

#### 1. Product & E-commerce Data
- **File**: `app/page.tsx`
  - Line 15: `// Mock data for homepage`
  - **Impact**: Homepage hiển thị sản phẩm giả
  - **Action**: Kết nối với Prisma để lấy featured products

- **File**: `app/products/[id]/page.tsx`
  - Line 15: `// Mock product data`
  - **Impact**: Chi tiết sản phẩm không thực
  - **Action**: Fetch product từ database theo ID

- **File**: `app/search/page.tsx`
  - Line 21: `// Mock data for search - now with multi-language support`
  - **Impact**: Kết quả tìm kiếm không thực
  - **Action**: Implement search API với Prisma

#### 2. Order & Transaction Data
- **File**: `app/orders/page.tsx`
  - Line 13: `// Mock orders data`
  - **Impact**: Danh sách đơn hàng không thực
  - **Action**: Fetch orders từ database theo user

- **File**: `app/orders/[id]/page.tsx`
  - Line 19-20: `// Mock order data` và `const mockOrderData = {`
  - Line 117: `const [order, setOrder] = useState(mockOrderData)`
  - **Impact**: Chi tiết đơn hàng không thực
  - **Action**: Fetch order detail từ database

- **File**: `app/checkout/page.tsx`
  - Line 17: `// Mock checkout data`
  - **Impact**: Checkout process có thể không hoạt động đúng
  - **Action**: Integrate với cart API và payment system

#### 3. User Account Data
- **File**: `app/account/components/personal-info.tsx`
  - Line 19: `// Mock user data - in a real app, this would come from your auth/user context`
  - **Impact**: Thông tin cá nhân không thực
  - **Action**: Fetch user data từ auth context

- **File**: `app/account/components/orders.tsx`
  - Line 14: `// Mock order data`
  - **Impact**: Lịch sử đơn hàng không thực
  - **Action**: Fetch user orders từ database

- **File**: `app/account/components/addresses.tsx`
  - Line 17: `// Mock address data`
  - **Impact**: Địa chỉ giao hàng không thực
  - **Action**: Fetch user addresses từ database

- **File**: `app/wishlist/page.tsx`
  - Line 16: `// Mock wishlist data`
  - **Impact**: Danh sách yêu thích không thực
  - **Action**: Fetch wishlist từ database

### 🟡 Trung bình - Cần thay thế (Admin & Analytics)

#### 4. Admin Analytics Data
- **File**: `app/admin/analytics/page.tsx`
  - Line 18: `// Mock analytics data`
  - **Impact**: Dashboard admin không chính xác
  - **Action**: Implement real analytics queries

- **File**: `app/admin/analytics/components/sales-analytics.tsx`
  - Line 28: `// Mock sales data`
  - **Impact**: Báo cáo bán hàng không chính xác
  - **Action**: Aggregate sales data từ orders table

### 🟢 Thấp - Có thể giữ lại (Static Content)

#### 5. Static/Content Data
- **File**: `app/about/page.tsx`
  - Line 11: `// Mock data cho team members`
  - Line 83: `// Mock data cho company stats`
  - Line 107: `// Mock data cho company values`
  - **Impact**: Thông tin công ty tĩnh
  - **Action**: Có thể giữ lại hoặc move to CMS

- **File**: `app/contact/page.tsx`
  - Line 16: `// Mock data cho contact info`
  - Line 70: `// Mock data cho FAQ`
  - Line 144: `// Mock data cho support categories`
  - **Impact**: Thông tin liên hệ tĩnh
  - **Action**: Có thể giữ lại hoặc move to CMS

### 🔵 Chức năng - Notification System

#### 6. Notification Data
- **File**: `hooks/use-notifications.ts`
  - Line 28: `const mockNotifications: NotificationData[] = [`
  - **Impact**: Thông báo giả lập
  - **Action**: Implement real-time notifications với WebSocket

- **File**: `lib/websocket.ts`
  - Line 132: `private sendMockNotification(notification: NotificationData) {`
  - **Impact**: WebSocket notifications giả lập
  - **Action**: Connect với real notification system

## Thống kê

- **Tổng số files có mock data**: 15 files
- **Mức độ cao (cần thay thế ngay)**: 8 files (Core business)
- **Mức độ trung bình (admin/analytics)**: 2 files
- **Mức độ thấp (static content)**: 3 files
- **Chức năng (notifications)**: 2 files

## Kế hoạch hành động

### Sprint 1: Core E-commerce (Tuần 1)
1. **Products & Search**
   - `app/page.tsx` - Featured products
   - `app/products/[id]/page.tsx` - Product details
   - `app/search/page.tsx` - Search functionality

2. **User Account**
   - `app/account/components/personal-info.tsx`
   - `app/wishlist/page.tsx`
   - `app/account/components/addresses.tsx`

### Sprint 2: Orders & Transactions (Tuần 2)
1. **Order Management**
   - `app/orders/page.tsx`
   - `app/orders/[id]/page.tsx`
   - `app/account/components/orders.tsx`

2. **Checkout Process**
   - `app/checkout/page.tsx`

### Sprint 3: Admin & Analytics (Tuần 3)
1. **Admin Dashboard**
   - `app/admin/analytics/page.tsx`
   - `app/admin/analytics/components/sales-analytics.tsx`

### Sprint 4: Notifications & Polish (Tuần 4)
1. **Real-time Features**
   - `hooks/use-notifications.ts`
   - `lib/websocket.ts`

2. **Static Content Review**
   - `app/about/page.tsx`
   - `app/contact/page.tsx`

## Database Schema Requirements

### Cần đảm bảo các tables sau đã có data:
- `products` - Sản phẩm
- `categories` - Danh mục
- `users` - Người dùng
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `addresses` - Địa chỉ
- `wishlists` - Danh sách yêu thích
- `notifications` - Thông báo

### API Endpoints cần implement:
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/[id]` - Chi tiết sản phẩm
- `GET /api/search` - Tìm kiếm sản phẩm
- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/[id]` - Chi tiết đơn hàng
- `GET /api/user/profile` - Thông tin người dùng
- `GET /api/user/addresses` - Địa chỉ người dùng
- `GET /api/user/wishlist` - Danh sách yêu thích
- `GET /api/admin/analytics` - Dữ liệu analytics

## Rủi ro và Biện pháp

### Rủi ro:
1. **Performance**: Queries phức tạp có thể chậm
2. **Data Consistency**: Mock data có thể không match với schema
3. **User Experience**: Transition từ mock sang real data

### Biện pháp:
1. **Optimization**: Sử dụng indexing và caching
2. **Testing**: Comprehensive testing với real data
3. **Gradual Migration**: Thay thế từng phần một

## Ghi chú
- Ưu tiên thay thế mock data ảnh hưởng đến core business logic
- Đảm bảo database đã được seed với data thực tế
- Test thoroughly sau mỗi thay thế
- Maintain backward compatibility trong quá trình migration