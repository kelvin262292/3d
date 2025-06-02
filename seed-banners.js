const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBanners() {
  try {
    console.log('🌱 Seeding banners...');

    // Xóa banners cũ
    await prisma.banner.deleteMany({});
    console.log('✅ Cleared existing banners');

    // Tạo banners mới
    const banners = [
      {
        title: 'Premium 3D Models',
        subtitle: 'For Professional Creators',
        image: '/hero-1.jpg',
        link: '/products',
        isActive: true,
        order: 1,
      },
      {
        title: 'High Quality Assets',
        subtitle: 'Ready to Use in Your Projects',
        image: '/hero-2.jpg',
        link: '/categories',
        isActive: true,
        order: 2,
      },
      {
        title: 'Professional Tools',
        subtitle: 'Advanced 3D Modeling Resources',
        image: '/hero-3.jpg',
        link: '/products?featured=true',
        isActive: true,
        order: 3,
      },
      {
        title: 'New Collection',
        subtitle: 'Latest 3D Models Available',
        image: '/placeholder.svg?height=400&width=800',
        link: '/products?sort=newest',
        isActive: false, // Inactive banner for testing
        order: 4,
      },
    ];

    for (const banner of banners) {
      const created = await prisma.banner.create({
        data: banner,
      });
      console.log(`✅ Created banner: ${created.title}`);
    }

    console.log('🎉 Banner seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBanners();