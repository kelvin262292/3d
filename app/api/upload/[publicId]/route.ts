import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// DELETE /api/upload/[publicId] - Delete uploaded file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { publicId } = params
    const url = new URL(request.url)
    const resourceType = url.searchParams.get('resource_type') as 'image' | 'video' | 'raw' || 'image'

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    // Decode the public ID (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId)

    // Check if the file belongs to the user (basic security check)
    // The public ID should contain the user's ID in the folder structure
    if (!decodedPublicId.includes(user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this file' },
        { status: 403 }
      )
    }

    // Delete from Cloudinary
    const result = await deleteFromCloudinary(decodedPublicId, resourceType)

    if (result.result === 'ok') {
      return NextResponse.json({
        message: 'File deleted successfully',
        publicId: decodedPublicId,
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}