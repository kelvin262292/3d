import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock products as fallback
const mockProducts = [
  {
    id: '1',
    name: 'Modern Villa 3D',
    description: 'High-quality 3D model of a modern villa',
    price: 299.00,
    slug: 'modern-villa-3d',
    images: ['/placeholder.svg'],
    modelUrl: '/models/villa.fbx',
    tags: ['villa', 'modern', 'architecture'],
    featured: true,
    inStock: true,
    downloads: 124,
    rating: 4.8,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '1',
    category: { name: 'Architecture', slug: 'architecture' },
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Sports Car Model',
    description: 'Detailed 3D sports car model',
    price: 450.00,
    slug: 'sports-car-model',
    images: ['/placeholder.svg'],
    modelUrl: '/models/car.fbx',
    tags: ['car', 'vehicle', 'sports'],
    featured: true,
    inStock: true,
    downloads: 89,
    rating: 4.9,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '2',
    category: { name: 'Vehicles', slug: 'vehicles' },
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Anime Character',
    description: 'Rigged anime character model',
    price: 199.00,
    slug: 'anime-character',
    images: ['/placeholder.svg'],
    modelUrl: '/models/character.fbx',
    tags: ['anime', 'character', 'rigged'],
    featured: false,
    inStock: true,
    downloads: 256,
    rating: 4.7,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '3',
    category: { name: 'Characters', slug: 'characters' },
    imageUrl: '/placeholder.svg'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12') || 12))
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      inStock: true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            has: search
          }
        }
      ]
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    
    if (featured === 'true') {
      orderBy = { featured: 'desc' }
    } else {
      switch (sort) {
        case 'price':
          orderBy = { price: order === 'asc' ? 'asc' : 'desc' }
          break
        case 'rating':
          orderBy = { rating: order === 'asc' ? 'asc' : 'desc' }
          break
        case 'downloads':
          orderBy = { downloads: order === 'asc' ? 'asc' : 'desc' }
          break
        case 'createdAt':
        default:
          orderBy = { createdAt: order === 'asc' ? 'asc' : 'desc' }
          break
      }
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Transform products to include imageUrl for frontend compatibility
    const transformedProducts = products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : ['/placeholder.svg'],
      imageUrl: product.images ? product.images.split(',')[0] : '/placeholder.svg'
    }))

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Database connection failed, using mock data:', error)
    
    // Filter mock products based on query parameters
    let filteredProducts = [...mockProducts]
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category.slug === category)
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    // Apply pagination
    const total = filteredProducts.length
    const startIndex = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)
    
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      source: 'mock',
      warning: 'Using mock data - database unavailable'
    })
  }
}