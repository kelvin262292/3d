const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAuth() {
  try {
    // Test password hashing
    const plainPassword = process.env.DEBUG_PASSWORD || 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    console.log('Plain password:', plainPassword);
    console.log('Hashed password:', hashedPassword);
    
    // Test password verification
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password verification test:', isValid);
    
    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });
    
    if (user) {
      console.log('User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      });
      
      // Test verification with stored password
      if (user.password) {
        const isStoredValid = await bcrypt.compare(plainPassword, user.password);
        console.log('Stored password verification:', isStoredValid);
      }
    } else {
      console.log('User not found in database');
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();