# Console.log Audit Report

## Tổng quan
Đây là danh sách chi tiết tất cả các `console.log` statements được tìm thấy trong codebase, được phân loại theo mức độ ưu tiên và loại.

## Phân loại Console.log

### 🔴 Cao - Cần loại bỏ ngay lập tức (Production Critical)

#### 1. Authentication & Security
- **File**: `app/api/auth/login/route.ts`
  - Line 70: `console.log('🍪 Setting cookie with config:', {`
  - Line 80: `console.log('🍪 Cookie set successfully, token length:', token.length)`
  - Line 101: `console.log('📤 Response created with cookie, headers:', response.headers)`
  - **Risk**: Có thể rò rỉ thông tin cookie và token

- **File**: `lib/auth.ts`
  - Line 44: `console.log('verifyToken - Token length:', token?.length, 'JWT_SECRET exists:', !!JWT_SECRET)`
  - Line 47: `console.log('verifyToken - Success:', !!payload, payload?.userId)`
  - Line 50: `console.log('verifyToken - Error:', error.message)`
  - **Risk**: Có thể rò rỉ thông tin JWT và user ID

- **File**: `middleware.ts`
  - Line 62: `console.log('Middleware - Token found:', !!token, 'Path:', pathname)`
  - Line 67: `console.log('Public route accessed:', pathname)`
  - Line 83: `console.log('Invalid token on auth route, allowing access')`
  - Line 112: `console.log('Middleware - Verifying token for protected route:', pathname)`
  - Line 114: `console.log('Middleware - Token verification result:', !!payload, payload?.userId)`
  - Line 117: `console.log('Middleware - Token verification failed, redirecting to login')`
  - **Risk**: Có thể rò rỉ thông tin routing và authentication flow

- **File**: `hooks/useAuth.ts`
  - Line 100: `console.log('Login function called with:', { email, password: '***', rememberMe })`
  - Line 114: `console.log('Login response status:', response.status)`
  - Line 116: `console.log('Login response data:', data)`
  - Line 134: `console.log('Redirecting to:', redirectTo)`
  - **Risk**: Có thể rò rỉ thông tin đăng nhập và response data

#### 2. Payment Processing
- **File**: `app/api/payments/webhook/route.ts`
  - Line 50: `console.log(\`Unhandled event type: ${event.type}\`)`
  - Line 82: `console.log(\`Payment succeeded for order ${orderId}\`)`
  - Line 111: `console.log(\`Payment failed for order ${orderId}\`)`
  - Line 140: `console.log(\`Payment canceled for order ${orderId}\`)`
  - **Risk**: Có thể rò rỉ thông tin thanh toán và order ID

### 🟡 Trung bình - Cần thay thế bằng proper logging

#### 3. Database Operations
- **File**: `prisma/seed.ts`
  - Line 71: `console.log('Created categories:', categories.length)`
  - Line 247: `console.log('Created products:', products.length)`
  - Line 263: `console.log('Created user:', user.email)`
  - Line 296: `console.log('Created sample cart items')`
  - Line 298: `console.log('🌱 Database seeded successfully!')`
  - **Note**: Seed script, có thể giữ lại nhưng nên sử dụng proper logger

#### 4. WebSocket & Real-time Features
- **File**: `lib/websocket.ts`
  - Line 58: `console.log("Heartbeat response received")`
  - Line 199: `console.log("WebSocket connected")`
  - Line 216: `console.log("WebSocket disconnected")`
  - Line 238: `console.log("Mock WebSocket connected")`
  - Line 255: `console.log("Mock WebSocket disconnected")`
  - Line 309: `console.log(`
  - **Note**: Connection logs, nên thay bằng proper logger

#### 5. User Interactions
- **File**: `components/notifications/notification-center.tsx`
  - Line 24: `console.log("Notification permission granted")`
  - **Note**: User permission log

- **File**: `app/account/components/account-sidebar.tsx`
  - Line 25: `console.log("Logging out...")`
  - **Note**: User action log

- **File**: `app/wishlist/page.tsx`
  - Line 83: `console.log("Added to cart:", id)`
  - **Note**: User action log

### 🟢 Thấp - Debug/Test files (Có thể giữ lại)

#### 6. Test & Debug Files
- **File**: `test-app.js` (37 console.log statements)
  - **Note**: Test file, có thể giữ lại hoặc sử dụng test logger

- **File**: `debug-api.js` (6 console.log statements)
  - **Note**: Debug file, có thể giữ lại hoặc sử dụng debug logger

- **File**: `debug-auth.js` (7 console.log statements)
  - **Note**: Debug file, có thể giữ lại hoặc sử dụng debug logger

- **File**: `hooks/useAuth.ts`
  - Line 90: `console.log('Auth check timed out')`
  - **Note**: Timeout log, có thể thay bằng proper error logging

## Thống kê

- **Tổng số console.log**: 65+ statements
- **Files có console.log**: 13 files
- **Mức độ cao (cần loại bỏ ngay)**: 20 statements
- **Mức độ trung bình (cần thay thế)**: 15 statements
- **Mức độ thấp (debug/test)**: 30+ statements

## Kế hoạch hành động

### Bước 1: Loại bỏ ngay lập tức (Mức độ cao)
1. Authentication & Security logs
2. Payment processing logs
3. Middleware logs

### Bước 2: Thay thế bằng proper logging (Mức độ trung bình)
1. Database operation logs
2. WebSocket connection logs
3. User interaction logs

### Bước 3: Đánh giá và quyết định (Mức độ thấp)
1. Test files - có thể giữ lại với test logger
2. Debug files - có thể giữ lại với debug logger
3. Development-only logs

## Ghi chú
- Tất cả console.log trong production code cần được thay thế bằng proper logging system
- Sử dụng environment variables để control log levels
- Implement Winston hoặc Pino cho server-side logging
- Cập nhật ESLint config để prevent future console.log