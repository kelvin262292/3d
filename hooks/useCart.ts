'use client'

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { useAuth } from './useAuth'

interface CartItem {
  id: string
  quantity: number
  productId: string
  userId: string
  createdAt: string
  updatedAt: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    inStock: boolean
    category: {
      name: string
      slug: string
    }
  }
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  totalItems: number
  subtotal: number
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  checkInventory: (productId: string, quantity: number) => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      // Load guest cart from localStorage
      loadGuestCart()
    }
  }, [user])

  // Persist cart to localStorage for guest users
  useEffect(() => {
    if (!user && items.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(items))
    }
  }, [items, user])

  const loadGuestCart = () => {
    try {
      const guestCart = localStorage.getItem('guestCart')
      if (guestCart) {
        const parsedCart = JSON.parse(guestCart)
        setItems(parsedCart)
      }
    } catch (error) {
      console.error('Error loading guest cart:', error)
    }
  }

  const syncGuestCartToUser = async () => {
    if (!user || items.length === 0) return

    try {
      // Sync each guest cart item to user's cart
      for (const item of items) {
        if (item.id.startsWith('temp-') || item.id.startsWith('guest-')) {
          await addToCart(item.productId, item.quantity)
        }
      }
      // Clear guest cart after sync
      localStorage.removeItem('guestCart')
    } catch (error) {
      console.error('Error syncing guest cart:', error)
    }
  }

  // Sync guest cart when user logs in
  useEffect(() => {
    if (user && items.some(item => item.id.startsWith('guest-'))) {
      syncGuestCartToUser()
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/cart', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      } else {
        console.error('Failed to load cart')
        setItems([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const checkInventory = async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const product = await response.json()
        return product.inStock && (product.stockQuantity === undefined || product.stockQuantity >= quantity)
      }
      return false
    } catch (error) {
      console.error('Error checking inventory:', error)
      return false
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    // Check inventory before adding
    const hasStock = await checkInventory(productId, quantity)
    if (!hasStock) {
      throw new Error('Product is out of stock or insufficient quantity available')
    }

    if (!user) {
      // Handle guest cart
      const guestItem: CartItem = {
        id: `guest-${Date.now()}`,
        quantity,
        productId,
        userId: 'guest',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          id: productId,
          name: 'Loading...',
          slug: '',
          price: 0,
          images: [],
          inStock: true,
          category: {
            name: 'Loading...',
            slug: ''
          }
        }
      }

      // Check if item already exists in guest cart
      const existingItemIndex = items.findIndex(item => item.productId === productId)
      if (existingItemIndex >= 0) {
        setItems(prevItems => 
          prevItems.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        )
      } else {
        setItems(prevItems => [...prevItems, guestItem])
      }
      return
    }

    // Optimistic update - add item immediately to UI
    const optimisticItem: CartItem = {
      id: `temp-${Date.now()}`,
      quantity,
      productId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: {
        id: productId,
        name: 'Loading...',
        slug: '',
        price: 0,
        images: [],
        inStock: true,
        category: {
          name: 'Loading...',
          slug: ''
        }
      }
    }

    // Check if item already exists
    const existingItemIndex = items.findIndex(item => item.productId === productId)
    if (existingItemIndex >= 0) {
      // Update existing item quantity optimistically
      setItems(prevItems => 
        prevItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      // Add new item optimistically
      setItems(prevItems => [...prevItems, optimisticItem])
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Rollback optimistic update on error
        if (existingItemIndex >= 0) {
          setItems(prevItems => 
            prevItems.map((item, index) => 
              index === existingItemIndex 
                ? { ...item, quantity: item.quantity - quantity }
                : item
            )
          )
        } else {
          setItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id))
        }
        throw new Error(data.error || 'Failed to add to cart')
      }

      // Refresh cart to get updated data with correct product info
      await loadCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return

    // Store original quantity for rollback
    const originalItem = items.find(item => item.id === itemId)
    if (!originalItem) return

    const originalQuantity = originalItem.quantity

    // Optimistic update
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Rollback on error
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: originalQuantity } : item
          )
        )
        throw new Error(data.error || 'Failed to update quantity')
      }

      // Success - optimistic update is already applied
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!user) return

    // Store original item for rollback
    const originalItem = items.find(item => item.id === itemId)
    if (!originalItem) return

    // Optimistic update - remove immediately
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        // Rollback on error - add item back
        setItems(prevItems => [...prevItems, originalItem])
        throw new Error(data.error || 'Failed to remove from cart')
      }

      // Success - optimistic update is already applied
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      // Remove all items one by one (you could create a bulk delete API)
      await Promise.all(items.map(item => removeFromCart(item.id)))
      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const refreshCart = async () => {
    await loadCart()
  }

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const value = {
    items,
    loading,
    totalItems,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    checkInventory,
  }

  return React.createElement(CartContext.Provider, { value }, children)
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}