const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Dữ liệu mẫu cho categories
const categories = [
  { name: 'Furniture', description: 'Bàn ghế, tủ kệ và các đồ nội thất 3D' },
  { name: 'Characters', description: 'Nhân vật 3D, con người và sinh vật' },
  { name: 'Vehicles', description: 'Xe cộ, máy bay, tàu thuyền' },
  { name: 'Architecture', description: 'Kiến trúc, nhà cửa, công trình' },
  { name: 'Electronics', description: 'Thiết bị điện tử, máy móc' },
  { name: 'Nature', description: 'Cây cối, đá, cảnh quan tự nhiên' },
  { name: 'Weapons', description: 'Vũ khí, công cụ chiến đấu' },
  { name: 'Food', description: 'Thức ăn, đồ uống' }
];

// Dữ liệu mẫu cho products
const products = [
  {
    name: 'Modern Office Chair',
    description: 'Ghế văn phòng hiện đại với thiết kế ergonomic, phù hợp cho không gian làm việc chuyên nghiệp.',
    price: 150.00,
    modelUrl: '/models/office-chair.glb',
    imageUrl: '/images/office-chair.jpg',
    category: 'Furniture',
    tags: ['office', 'chair', 'modern', 'ergonomic'],
    featured: true
  },
  {
    name: 'Wooden Dining Table',
    description: 'Bàn ăn gỗ tự nhiên với thiết kế cổ điển, hoàn hảo cho phòng ăn gia đình.',
    price: 299.99,
    modelUrl: '/models/dining-table.glb',
    imageUrl: '/images/dining-table.jpg',
    category: 'Furniture',
    tags: ['dining', 'table', 'wood', 'classic'],
    featured: true
  },
  {
    name: 'Sci-Fi Robot Character',
    description: 'Nhân vật robot khoa học viễn tưởng với animation sẵn có, phù hợp cho game và phim.',
    price: 89.99,
    modelUrl: '/models/robot-character.glb',
    imageUrl: '/images/robot-character.jpg',
    category: 'Characters',
    tags: ['robot', 'sci-fi', 'character', 'animated'],
    featured: false
  },
  {
    name: 'Sports Car',
    description: 'Xe thể thao hiện đại với chi tiết cao, bao gồm nội thất và động cơ.',
    price: 199.99,
    modelUrl: '/models/sports-car.glb',
    imageUrl: '/images/sports-car.jpg',
    category: 'Vehicles',
    tags: ['car', 'sports', 'vehicle', 'detailed'],
    featured: true
  },
  {
    name: 'Modern House',
    description: 'Ngôi nhà hiện đại với kiến trúc tối giản, bao gồm nội thất cơ bản.',
    price: 399.99,
    modelUrl: '/models/modern-house.glb',
    imageUrl: '/images/modern-house.jpg',
    category: 'Architecture',
    tags: ['house', 'modern', 'architecture', 'minimalist'],
    featured: false
  },
  {
    name: 'Gaming Laptop',
    description: 'Laptop gaming với thiết kế chi tiết, bao gồm màn hình và bàn phím có đèn.',
    price: 79.99,
    modelUrl: '/models/gaming-laptop.glb',
    imageUrl: '/images/gaming-laptop.jpg',
    category: 'Electronics',
    tags: ['laptop', 'gaming', 'electronics', 'detailed'],
    featured: false
  },
  {
    name: 'Oak Tree',
    description: 'Cây sồi cổ thụ với lá và cành chi tiết, phù hợp cho cảnh quan tự nhiên.',
    price: 45.99,
    modelUrl: '/models/oak-tree.glb',
    imageUrl: '/images/oak-tree.jpg',
    category: 'Nature',
    tags: ['tree', 'oak', 'nature', 'landscape'],
    featured: false
  },
  {
    name: 'Medieval Sword',
    description: 'Kiếm thời trung cổ với chi tiết kim loại và trang trí cổ điển.',
    price: 29.99,
    modelUrl: '/models/medieval-sword.glb',
    imageUrl: '/images/medieval-sword.jpg',
    category: 'Weapons',
    tags: ['sword', 'medieval', 'weapon', 'metal'],
    featured: false
  },
  {
    name: 'Pizza Slice',
    description: 'Miếng pizza với topping chi tiết, phù hợp cho game và animation thực phẩm.',
    price: 19.99,
    modelUrl: '/models/pizza-slice.glb',
    imageUrl: '/images/pizza-slice.jpg',
    category: 'Food',
    tags: ['pizza', 'food', 'slice', 'detailed'],
    featured: false
  },
  {
    name: 'Coffee Cup',
    description: 'Tách cà phê với thiết kế hiện đại, bao gồm đĩa lót và thìa.',
    price: 15.99,
    modelUrl: '/models/coffee-cup.glb',
    imageUrl: '/images/coffee-cup.jpg',
    category: 'Food',
    tags: ['coffee', 'cup', 'drink', 'modern'],
    featured: false
  }
];

// Dữ liệu user mẫu
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER'
};

async function main() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu...');

    // Xóa dữ liệu cũ
    console.log('🗑️ Xóa dữ liệu cũ...');
    await prisma.wishlist.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Tạo categories
    console.log('📁 Tạo categories...');
    const createdCategories = await Promise.all(
      categories.map(category => 
        prisma.category.create({ data: category })
      )
    );
    console.log(`✅ Đã tạo ${createdCategories.length} categories`);

    // Tạo user test
    console.log('👤 Tạo user test...');
    const createdUser = await prisma.user.create({ data: testUser });
    console.log(`✅ Đã tạo user: ${createdUser.email}`);

    // Tạo products
    console.log('📦 Tạo products...');
    const createdProducts = [];
    
    for (const product of products) {
      const category = createdCategories.find(c => c.name === product.category);
      if (category) {
        const createdProduct = await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            modelUrl: product.modelUrl,
            imageUrl: product.imageUrl,
            categoryId: category.id,
            tags: product.tags,
            featured: product.featured,
            downloads: Math.floor(Math.random() * 1000),
            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)) // Rating từ 3.0 đến 5.0
          }
        });
        createdProducts.push(createdProduct);
      }
    }
    
    console.log(`✅ Đã tạo ${createdProducts.length} products`);

    // Tạo một số wishlist items
    console.log('❤️ Tạo wishlist items...');
    const wishlistItems = createdProducts.slice(0, 3).map(product => ({
      userId: createdUser.id,
      productId: product.id
    }));
    
    await Promise.all(
      wishlistItems.map(item => 
        prisma.wishlist.create({ data: item })
      )
    );
    console.log(`✅ Đã tạo ${wishlistItems.length} wishlist items`);

    // Tạo một order mẫu
    console.log('🛒 Tạo order mẫu...');
    const sampleOrder = await prisma.order.create({
      data: {
        userId: createdUser.id,
        total: 449.98,
        status: 'DELIVERED',
        items: {
          create: [
            {
              productId: createdProducts[0].id,
              quantity: 1,
              price: createdProducts[0].price
            },
            {
              productId: createdProducts[1].id,
              quantity: 1,
              price: createdProducts[1].price
            }
          ]
        }
      }
    });
    console.log(`✅ Đã tạo order: ${sampleOrder.id}`);

    console.log('\n🎉 Seed dữ liệu hoàn tất!');
    console.log('📊 Thống kê:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Users: 1`);
    console.log(`   - Wishlist items: ${wishlistItems.length}`);
    console.log(`   - Orders: 1`);
    console.log('\n🔗 Bạn có thể đăng nhập với:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   (Sử dụng NextAuth với provider phù hợp)`);

  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
if (require.main === module) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };