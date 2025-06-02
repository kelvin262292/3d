'use client'

import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { useAuth } from './useAuth'

interface WishlistItem {
  id: string
  productId: string
  userId: string
  createdAt: string
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

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  totalItems: number
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (productId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load wishlist when user changes
  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setItems([])
    }
  }, [user])

  const loadWishlist = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/wishlist', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      } else {
        console.error('Failed to load wishlist')
        setItems([])
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!user) {
      throw new Error('Please login to add items to wishlist')
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to wishlist')
      }

      // Add to local state
      setItems(prevItems => [...prevItems, data.item])
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove from wishlist')
      }

      // Remove from local state
      setItems(prevItems => prevItems.filter(item => item.productId !== productId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }
  }

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId)
  }

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }

  const refreshWishlist = async () => {
    await loadWishlist()
  }

  const totalItems = items.length

  const value = {
    items,
    loading,
    totalItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist,
  }

  return React.createElement(WishlistContext.Provider, { value }, children)
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}