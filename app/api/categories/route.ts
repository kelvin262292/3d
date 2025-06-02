import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock categories as fallback
const mockCategories = [
  {
    id: '1',
    name: 'Architecture',
    name_vi: 'Kiến trúc',
    description: '3D architectural models',
    slug: 'architecture',
    image: '/placeholder.svg',
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { products: 25 }
  },
  {
    id: '2',
    name: 'Vehicles',
    name_vi: 'Xe cộ',
    description: '3D vehicle models',
    slug: 'vehicles',
    image: '/placeholder.svg',
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { products: 18 }
  },
  {
    id: '3',
    name: 'Characters',
    name_vi: 'Nhân vật',
    description: '3D character models',
    slug: 'characters',
    image: '/placeholder.svg',
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { products: 32 }
  }
]

export async function GET() {
  try {
    // Try to connect to database
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ categories, source: 'database' })
  } catch (error) {
    console.error('Database connection failed, using mock data:', error)
    
    // Return mock data when database is unavailable
    return NextResponse.json({ 
      categories: mockCategories, 
      source: 'mock',
      warning: 'Using mock data - database unavailable'
    })
  }
}