import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

// Mock featured products data
const mockFeaturedProducts = [
  {
    id: '1',
    name: 'Modern Villa 3D',
    description: 'High-quality 3D model of a modern villa with detailed textures and materials',
    price: 299.00,
    slug: 'modern-villa-3d',
    images: ['/placeholder.svg?height=300&width=300'],
    modelUrl: '/models/villa.fbx',
    tags: ['villa', 'modern', 'architecture'],
    featured: true,
    inStock: true,
    downloads: 124,
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categoryId: '1',
    category: { name: 'Architecture', slug: 'architecture' },
    imageUrl: '/placeholder.svg?height=300&width=300'
  },
  {
    id: '2',
    name: 'Sports Car Model',
    description: 'Detailed 3D sports car model with realistic materials and textures',
    price: 450.00,
    slug: 'sports-car-model',
    images: ['/placeholder.svg?height=300&width=300'],
    modelUrl: '/models/car.fbx',
    tags: ['car', 'vehicle', 'sports'],
    featured: true,
    inStock: true,
    downloads: 89,
    rating: 4.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categoryId: '2',
    category: { name: 'Vehicles', slug: 'vehicles' },
    imageUrl: '/placeholder.svg?height=300&width=300'
  },
  {
    id: '3',
    name: 'Anime Character',
    description: 'Rigged anime character model ready for animation',
    price: 199.00,
    slug: 'anime-character',
    images: ['/placeholder.svg?height=300&width=300'],
    modelUrl: '/models/character.fbx',
    tags: ['anime', 'character', 'rigged'],
    featured: true,
    inStock: true,
    downloads: 256,
    rating: 4.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categoryId: '3',
    category: { name: 'Characters', slug: 'characters' },
    imageUrl: '/placeholder.svg?height=300&width=300'
  },
  {
    id: '4',
    name: 'Mythical Dragon',
    description: 'Fantasy dragon model with detailed scales and wings',
    price: 350.00,
    slug: 'mythical-dragon',
    images: ['/placeholder.svg?height=300&width=300'],
    modelUrl: '/models/dragon.fbx',
    tags: ['dragon', 'fantasy', 'creature'],
    featured: true,
    inStock: true,
    downloads: 67,
    rating: 4.6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categoryId: '4',
    category: { name: 'Creatures', slug: 'creatures' },
    imageUrl: '/placeholder.svg?height=300&width=300'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(10, Math.max(1, parseInt(searchParams.get('limit') || '4') || 4))
    
    // Try to get featured products from database
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Transform products to include imageUrl for frontend compatibility
    const transformedProducts = featuredProducts.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : ['/placeholder.svg'],
      imageUrl: product.images ? product.images.split(',')[0] : '/placeholder.svg'
    }))
    
    logger.info('Featured products API called successfully', 'API', { 
      count: transformedProducts.length,
      limit,
      source: 'database'
    })
    
    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page: 1,
        limit,
        total: transformedProducts.length,
        pages: 1
      },
      source: 'database'
    })
  } catch (error) {
    logger.error('Featured products API error, falling back to mock data', 'API', { error })
    
    // Fallback to mock data
    const featuredProducts = mockFeaturedProducts.slice(0, parseInt(searchParams?.get('limit') || '4'))
    
    return NextResponse.json({
      products: featuredProducts,
      pagination: {
        page: 1,
        limit: featuredProducts.length,
        total: featuredProducts.length,
        pages: 1
      },
      source: 'mock',
      warning: 'Using mock data - database unavailable'
    })
  }
}