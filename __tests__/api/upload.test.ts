/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST, GET } from '../../app/api/upload/route'

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: 'test/mock-image',
        secure_url: 'https://res.cloudinary.com/demo/image/upload/test/mock-image.jpg',
        original_filename: 'test-image',
        bytes: 1024,
        created_at: '2024-01-01T00:00:00Z',
      }),
    },
  },
}))

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: { id: '1', email: 'test@example.com' },
  }),
}))

describe('/api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock environment variables
    process.env.CLOUDINARY_CLOUD_NAME = 'demo'
    process.env.CLOUDINARY_API_KEY = 'demo-key'
    process.env.CLOUDINARY_API_SECRET = 'demo-secret'
  })

  describe('GET /api/upload', () => {
    it('should return upload guidelines', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.guidelines).toBeDefined()
      expect(data.data.guidelines.allowedTypes).toContain('image/jpeg')
      expect(data.data.guidelines.allowedTypes).toContain('image/png')
      expect(data.data.guidelines.maxSize).toBe(52428800) // 50MB
      expect(data.data.guidelines.maxFiles).toBe(10)
    })

    it('should show Cloudinary configuration status', async () => {
      const request = new NextRequest('http://localhost:3000/api/upload')
      const response = await GET(request)
      const data = await response.json()

      expect(data.data.cloudinary.configured).toBe(true)
      expect(data.data.cloudinary.mockMode).toBe(false)
    })
  })

  describe('POST /api/upload', () => {
    it('should handle single file upload', async () => {
      const formData = new FormData()
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      formData.append('file', file)
      formData.append('folder', 'test')
      formData.append('type', 'image')

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.url).toBeDefined()
      expect(data.data.publicId).toBeDefined()
      expect(data.data.originalName).toBe('test.jpg')
    })

    it('should reject files that are too large', async () => {
      const formData = new FormData()
      // Create a mock file that's too large (over 50MB)
      const largeFile = new File(['x'.repeat(60 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      formData.append('file', largeFile)
      formData.append('folder', 'test')
      formData.append('type', 'image')

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('File size too large')
    })

    it('should reject unsupported file types', async () => {
      const formData = new FormData()
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
      formData.append('file', file)
      formData.append('folder', 'test')
      formData.append('type', 'image')

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid file type')
    })

    it('should handle missing file', async () => {
      const formData = new FormData()
      formData.append('folder', 'test')
      formData.append('type', 'image')

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('No file provided')
    })

    it('should use mock mode when Cloudinary is not configured', async () => {
      // Clear Cloudinary config
      delete process.env.CLOUDINARY_CLOUD_NAME
      delete process.env.CLOUDINARY_API_KEY
      delete process.env.CLOUDINARY_API_SECRET

      const formData = new FormData()
      const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      formData.append('file', file)
      formData.append('folder', 'test')
      formData.append('type', 'image')

      const request = new NextRequest('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.url).toContain('mock-upload')
      expect(data.data.mockMode).toBe(true)
    })
  })
})