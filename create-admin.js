const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Tạo user admin...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Tạo hoặc cập nhật user admin
    const admin = await prisma.user.upsert({
      where: {
        email: 'admin@example.com'
      },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        username: 'admin'
      }
    });
    
    console.log('✅ Đã tạo user admin:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Chạy script
if (require.main === module) {
  createAdmin()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { createAdmin };