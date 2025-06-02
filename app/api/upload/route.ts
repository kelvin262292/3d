import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

// POST /api/upload - Upload files to Cloudinary
export async function POST(request: NextRequest) {
  try {
    // For testing, skip authentication
    // const user = await getCurrentUser(request)
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   )
    // }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'
    const type = formData.get('type') as string || 'auto'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const allowedModelTypes = ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream']
    const allowedExtensions = ['.glb', '.gltf', '.fbx', '.obj', '.blend']
    
    const isImage = allowedImageTypes.includes(file.type)
    const isModel = allowedModelTypes.includes(file.type) || 
                   allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!isImage && !isModel) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and 3D models are allowed.' },
        { status: 400 }
      )
    }

    // Check if Cloudinary is configured
    const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET &&
                               process.env.CLOUDINARY_CLOUD_NAME !== 'demo'

    if (!hasCloudinaryConfig) {
      // Return mock response for testing
      const mockResponse = {
        url: `https://res.cloudinary.com/demo/${type}/upload/v1/${folder}/${file.name}`,
        public_id: `${folder}/${file.name.split('.')[0]}_${Date.now()}`,
        format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
        resource_type: isImage ? 'image' : 'raw',
        bytes: file.size,
        width: isImage ? 800 : undefined,
        height: isImage ? 600 : undefined,
        fileName: file.name,
        originalSize: file.size
      }

      console.log('Using mock upload (Cloudinary not configured):', file.name)
      return NextResponse.json(mockResponse)
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload options
    const uploadOptions = {
      folder: folder,
      resource_type: isImage ? 'image' : 'raw',
      format: isImage ? undefined : file.name.split('.').pop()?.toLowerCase(),
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, uploadOptions)

    // Format response
    const response = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      resource_type: uploadResult.resource_type,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      fileName: file.name,
      originalSize: file.size
    }

    console.log('Cloudinary upload successful:', file.name)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

// GET /api/upload - Get upload guidelines
export async function GET() {
  return NextResponse.json({
    guidelines: {
      allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      allowedModelTypes: ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream'],
      allowedExtensions: ['.glb', '.gltf', '.fbx', '.obj', '.blend'],
      maxSize: '50MB',
      folders: ['products', 'avatars', 'uploads', 'test-images', 'test-models', 'test-mixed'],
    },
    endpoints: {
      upload: '/api/upload',
      test: '/test-upload',
    },
    status: {
      cloudinaryConfigured: process.env.CLOUDINARY_CLOUD_NAME !== 'demo',
      mockMode: process.env.CLOUDINARY_CLOUD_NAME === 'demo'
    }
  })
}