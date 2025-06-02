import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadOptions {
  folder?: string
  public_id?: string
  resource_type?: 'image' | 'video' | 'raw' | 'auto'
  format?: string
  transformation?: any[]
  tags?: string[]
}

export interface UploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  folder?: string
  created_at: string
}

/**
 * Upload file to Cloudinary
 * @param file - File buffer or base64 string
 * @param options - Upload options
 * @returns Upload result
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const uploadOptions = {
      folder: options.folder || 'uploads',
      resource_type: options.resource_type || 'auto',
      public_id: options.public_id,
      format: options.format,
      transformation: options.transformation,
      tags: options.tags,
      ...options,
    }

    const result = await cloudinary.uploader.upload(
      file instanceof Buffer ? `data:image/jpeg;base64,${file.toString('base64')}` : file,
      uploadOptions
    )

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      folder: result.folder,
      created_at: result.created_at,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource (image, video, raw)
 * @returns Deletion result
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}

/**
 * Generate optimized image URL with transformations
 * @param publicId - Public ID of the image
 * @param transformations - Array of transformations
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: any[] = []
): string {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      ...transformations,
    ],
  })
}

/**
 * Generate thumbnail URL
 * @param publicId - Public ID of the image
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(
  publicId: string,
  width: number = 300,
  height: number = 300
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
  })
}

/**
 * Upload multiple files
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Array of upload results
 */
export async function uploadMultipleFiles(
  files: (Buffer | string)[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadToCloudinary(file, {
        ...options,
        public_id: options.public_id ? `${options.public_id}_${index}` : undefined,
      })
    )

    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Multiple files upload error:', error)
    throw new Error('Failed to upload multiple files')
  }
}

export { cloudinary }