/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/api/*',
    '/auth/*',
    '/dashboard/*',
    '/test-upload',
    '/server-sitemap-index.xml'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/dashboard/',
          '/test-upload'
        ]
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXTAUTH_URL || 'https://your-domain.com'}/server-sitemap-index.xml`
    ]
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString()
    }

    // Homepage
    if (path === '/') {
      return {
        ...customConfig,
        priority: 1.0,
        changefreq: 'daily'
      }
    }

    // Product pages
    if (path.startsWith('/products/')) {
      return {
        ...customConfig,
        priority: 0.9,
        changefreq: 'weekly'
      }
    }

    // Category pages
    if (path.startsWith('/categories/')) {
      return {
        ...customConfig,
        priority: 0.8,
        changefreq: 'weekly'
      }
    }

    // Static pages
    if (['/about', '/contact', '/help', '/terms', '/privacy'].includes(path)) {
      return {
        ...customConfig,
        priority: 0.6,
        changefreq: 'monthly'
      }
    }

    return customConfig
  },
  additionalPaths: async (config) => {
    const result = []

    // Add dynamic product pages
    // Note: In production, you would fetch this from your database
    try {
      // Example: Add featured products
      const featuredProducts = [
        { id: '1', slug: 'product-1' },
        { id: '2', slug: 'product-2' }
      ]

      featuredProducts.forEach(product => {
        result.push({
          loc: `/products/${product.id}`,
          changefreq: 'weekly',
          priority: 0.9,
          lastmod: new Date().toISOString()
        })
      })

      // Add category pages
      const categories = [
        { id: '1', slug: 'electronics' },
        { id: '2', slug: 'furniture' }
      ]

      categories.forEach(category => {
        result.push({
          loc: `/categories/${category.id}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Error generating additional sitemap paths:', error)
    }

    return result
  }
}