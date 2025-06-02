import { NextRequest, NextResponse } from 'next/server'

// Mock upload endpoint for testing file upload functionality
// This simulates Cloudinary upload without requiring real credentials

export async function POST(request: NextRequest) {
  try {
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

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate mock response similar to Cloudinary
    const mockResponse = {
      url: `https://res.cloudinary.com/demo/${type}/upload/v1/${folder}/${file.name}`,
      public_id: `${folder}/${file.name.split('.')[0]}_${Date.now()}`,
      format: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      resource_type: isImage ? 'image' : 'raw',
      bytes: file.size,
      width: isImage ? 800 : undefined,
      height: isImage ? 600 : undefined,
      fileName: file.name,
      originalSize: file.size,
      created_at: new Date().toISOString(),
      secure_url: `https://res.cloudinary.com/demo/${type}/upload/v1/${folder}/${file.name}`
    }

    console.log('Mock upload successful:', {
      fileName: file.name,
      size: file.size,
      type: file.type,
      folder,
      mockUrl: mockResponse.url
    })

    return NextResponse.json(mockResponse)

  } catch (error) {
    console.error('Mock upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}