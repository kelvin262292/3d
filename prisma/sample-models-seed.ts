// Sample 3D Models Data
const sampleModels = [
  {
    name: 'Avocado',
    description: 'A realistic avocado model',
    price: 29.99,
    category: 'furniture',
    modelUrl: '/models/furniture/Avocado.glb',
    imageUrl: '/images/avocado-preview.jpg',
    tags: ['furniture', 'food', 'organic'],
    userId: 1
  },
  {
    name: 'Antique Camera',
    description: 'A vintage camera model',
    price: 199.99,
    category: 'electronics',
    modelUrl: '/models/electronics/AntiqueCamera.glb',
    imageUrl: '/images/camera-preview.jpg',
    tags: ['electronics', 'camera', 'vintage'],
    userId: 1
  },
  {
    name: 'Damaged Helmet',
    description: 'A battle-worn helmet',
    price: 149.99,
    category: 'fashion',
    modelUrl: '/models/fashion/DamagedHelmet.glb',
    imageUrl: '/images/helmet-preview.jpg',
    tags: ['fashion', 'helmet', 'armor'],
    userId: 1
  }
];

// Add this to your existing seed.ts file
// await prisma.model.createMany({ data: sampleModels });
