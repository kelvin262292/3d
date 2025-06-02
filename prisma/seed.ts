import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Characters' },
      update: {},
      create: {
        name: 'Characters',
        description: '3D character models for games and animation',
        slug: 'characters',
        image: '/images/categories/characters.jpg'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Vehicles' },
      update: {},
      create: {
        name: 'Vehicles',
        description: 'Cars, planes, ships and other vehicles',
        slug: 'vehicles',
        image: '/images/categories/vehicles.jpg'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Architecture' },
      update: {},
      create: {
        name: 'Architecture',
        description: 'Buildings, houses and architectural elements',
        slug: 'architecture',
        image: '/images/categories/architecture.jpg'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Nature' },
      update: {},
      create: {
        name: 'Nature',
        description: 'Trees, plants, rocks and natural elements',
        slug: 'nature',
        image: '/images/categories/nature.jpg'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Furniture' },
      update: {},
      create: {
        name: 'Furniture',
        description: 'Chairs, tables, sofas and home furniture',
        slug: 'furniture',
        image: '/images/categories/furniture.jpg'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Phones, computers, gadgets and electronics',
        slug: 'electronics',
        image: '/images/categories/electronics.jpg'
      }
    })
  ])

  // Categories created successfully

  // Create sample products
  const products = await Promise.all([
    // Characters
    prisma.product.upsert({
      where: { slug: 'warrior-character' },
      update: {},
      create: {
        name: 'Warrior Character',
        description: 'High-quality 3D warrior character model with detailed armor and weapons. Perfect for fantasy games and animations.',
        price: 29.99,
        slug: 'warrior-character',
        images: JSON.stringify([
          '/warrior-character.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ]),
        modelUrl: '/models/warrior.glb',
        tags: JSON.stringify(['character', 'warrior', 'fantasy', 'armor']),
        featured: true,
        rating: 4.8,
        downloads: 1250,
        categoryId: categories[0].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'scifi-robot' },
      update: {},
      create: {
        name: 'Sci-Fi Robot',
        description: 'Futuristic robot character with advanced materials and rigging. Ideal for sci-fi projects.',
        price: 39.99,
        slug: 'scifi-robot',
        images: JSON.stringify([
          '/scifi-robot.svg',
          '/placeholder.svg'
        ]),
        modelUrl: '/models/robot.glb',
        tags: JSON.stringify(['character', 'robot', 'sci-fi', 'futuristic']),
        featured: true,
        rating: 4.9,
        downloads: 890,
        categoryId: categories[0].id
      }
    }),
    
    // Vehicles
    prisma.product.upsert({
      where: { slug: 'sports-car' },
      update: {},
      create: {
        name: 'Sports Car',
        description: 'Detailed sports car model with realistic materials and interior. Ready for games and visualization.',
        price: 49.99,
        slug: 'sports-car',
        images: JSON.stringify([
          '/sports-car.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ]),
        modelUrl: '/models/sports-car.glb',
        tags: JSON.stringify(['vehicle', 'car', 'sports', 'realistic']),
        featured: true,
        rating: 4.7,
        downloads: 2100,
        categoryId: categories[1].id
      }
    }),
    prisma.product.upsert({
      where: { slug: 'military-helicopter' },
      update: {},
      create: {
        name: 'Military Helicopter',
        description: 'Detailed military helicopter with animated rotors and realistic textures.',
        price: 59.99,
        slug: 'military-helicopter',
        images: JSON.stringify([
          '/images/products/helicopter-1.jpg',
          '/images/products/helicopter-2.jpg'
        ]),
        modelUrl: '/models/helicopter.glb',
        tags: JSON.stringify(['vehicle', 'helicopter', 'military', 'aircraft']),
        rating: 4.6,
        downloads: 750,
        categoryId: categories[1].id
      }
    }),
    
    // Architecture
    prisma.product.upsert({
      where: { slug: 'modern-house' },
      update: {},
      create: {
        name: 'Modern House',
        description: 'Contemporary house model with detailed interior and exterior. Perfect for architectural visualization.',
        price: 79.99,
        slug: 'modern-house',
        images: JSON.stringify([
          '/modern-house.svg',
          '/placeholder.svg',
          '/placeholder.svg'
        ]),
        modelUrl: '/models/modern-house.glb',
        tags: JSON.stringify(['architecture', 'house', 'modern', 'building']),
        featured: true,
        rating: 4.9,
        downloads: 1800,
        categoryId: categories[2].id
      }
    }),
    
    // Nature
    prisma.product.upsert({
      where: { slug: 'oak-tree-pack' },
      update: {},
      create: {
        name: 'Oak Tree Pack',
        description: 'Collection of 5 different oak tree models with seasonal variations. High-quality bark and leaf textures.',
        price: 24.99,
        slug: 'oak-tree-pack',
        images: JSON.stringify([
          '/images/products/trees-1.jpg',
          '/images/products/trees-2.jpg'
        ]),
        modelUrl: '/models/oak-trees.glb',
        tags: JSON.stringify(['nature', 'tree', 'oak', 'forest', 'pack']),
        rating: 4.5,
        downloads: 950,
        categoryId: categories[3].id
      }
    }),
    
    // Furniture
    prisma.product.upsert({
      where: { slug: 'office-chair' },
      update: {},
      create: {
        name: 'Office Chair',
        description: 'Ergonomic office chair with realistic materials and adjustable parts. Perfect for office scenes.',
        price: 19.99,
        slug: 'office-chair',
        images: JSON.stringify([
          '/images/products/chair-1.jpg',
          '/images/products/chair-2.jpg'
        ]),
        modelUrl: '/models/office-chair.glb',
        tags: JSON.stringify(['furniture', 'chair', 'office', 'ergonomic']),
        rating: 4.3,
        downloads: 1200,
        categoryId: categories[4].id
      }
    }),
    
    // Electronics
    prisma.product.upsert({
      where: { slug: 'gaming-laptop' },
      update: {},
      create: {
        name: 'Gaming Laptop',
        description: 'High-end gaming laptop model with detailed keyboard, screen, and ports. Perfect for tech scenes.',
        price: 34.99,
        slug: 'gaming-laptop',
        images: JSON.stringify([
          '/images/products/laptop-1.jpg',
          '/images/products/laptop-2.jpg'
        ]),
        modelUrl: '/models/gaming-laptop.glb',
        tags: JSON.stringify(['electronics', 'laptop', 'gaming', 'computer']),
        rating: 4.7,
        downloads: 680,
        categoryId: categories[5].id
      }
    })
  ])

  // Products created successfully

  // Create a sample user
  // Create demo user with hashed password
  const hashedPassword = await hashPassword('password123')
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      avatar: '/images/avatars/demo-user.jpg'
    }
  })

  // User created successfully

  // Create sample cart items
  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: products[0].id
      }
    },
    update: { quantity: 1 },
    create: {
      userId: user.id,
      productId: products[0].id,
      quantity: 1
    }
  })

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: products[2].id
      }
    },
    update: { quantity: 2 },
    create: {
      userId: user.id,
      productId: products[2].id,
      quantity: 2
    }
  })

  // Sample cart items created

  // Database seeded successfully
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })