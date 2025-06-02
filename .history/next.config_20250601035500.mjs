/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['stripe'],
  experimental: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('stripe')
    }
    
    // Cấu hình cho StagewiseToolbar
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      path: false,
      os: false,
      buffer: false,
      util: false,
      assert: false,
      constants: false,
      events: false,
      http: false,
      https: false,
      url: false,
      zlib: false
    }
    
    return config
  },
}

export default nextConfig