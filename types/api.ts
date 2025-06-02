// API Response Types for 3D Model Store

// Base API Response
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  total: number
  pages: number
}

// User Types
export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  _count: {
    orders: number
    wishlistItems: number
    cartItems: number
  }
}

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface AuthError {
  message: string
  code?: string
  field?: string
}

// Category Types
export interface Category {
  id: string
  name: string
  name_vi?: string
  slug: string
  description: string | null
  description_vi?: string
  image: string | null
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

export interface CategoryWithProducts extends Category {
  products: Product[]
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  slug: string
  images: string[]
  modelUrl: string | null
  tags: string[]
  featured: boolean
  inStock: boolean
  downloads: number
  rating: number
  createdAt: string
  updatedAt: string
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
}

export interface ProductsResponse {
  products: Product[]
  pagination: PaginationParams
  filters?: {
    categories: Category[]
    priceRange: {
      min: number
      max: number
    }
    tags: string[]
  }
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  featured?: boolean
  inStock?: boolean
  search?: string
  sort?: 'name' | 'price' | 'rating' | 'downloads' | 'createdAt'
  order?: 'asc' | 'desc'
}

// Cart Types
export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
    inStock: boolean
  }
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  total: number
  itemCount: number
  updatedAt: string
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

// Wishlist Types
export interface WishlistItem {
  id: string
  productId: string
  userId: string
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
    rating: number
    category: string
  }
}

export interface Wishlist {
  items: WishlistItem[]
  total: number
}

export interface AddToWishlistRequest {
  productId: string
}

// Order Types
export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
    slug: string
  }
}

export interface Order {
  id: string
  userId: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  items: {
    productId: string
    quantity: number
  }[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
}

// Search Types
export interface SearchFilters extends ProductFilters {
  query: string
}

export interface SearchResponse {
  products: Product[]
  categories: Category[]
  suggestions: string[]
  pagination: PaginationParams
  query: string
  totalResults: number
}

// Error Types
export interface ApiError {
  message: string
  code?: string | number
  field?: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Upload Types
export interface UploadResponse {
  url: string
  publicId: string
  format: string
  size: number
}

// Analytics Types (for admin)
export interface AnalyticsData {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  topProducts: Product[]
  topCategories: Category[]
  recentOrders: Order[]
  salesData: {
    date: string
    sales: number
    orders: number
  }[]
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  read: boolean
  createdAt: string
}

// Type Guards
export function isApiError(error: any): error is ApiError {
  return error && typeof error.message === 'string'
}

export function isValidationError(error: any): error is ValidationError {
  return error && typeof error.field === 'string' && typeof error.message === 'string'
}

// API Client Types
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

// Hook Types
export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export interface UsePaginationState {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
}