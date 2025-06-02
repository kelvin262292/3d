'use client'

import React from 'react'
import FileUpload, { UploadedFile } from '@/components/file-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function TestUploadPage() {
  const handleUpload = (files: UploadedFile[]) => {
    console.log('Uploaded files:', files)
    toast.success(`Successfully uploaded ${files.length} file(s)`)
  }

  const handleError = (error: string) => {
    console.error('Upload error:', error)
    toast.error(`Upload error: ${error}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test File Upload</h1>
        
        <div className="grid gap-8">
          {/* Image Upload Test */}
          <Card>
            <CardHeader>
              <CardTitle>Image Upload Test</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUpload={handleUpload}
                onError={handleError}
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
                }}
                maxFiles={3}
                maxSize={10 * 1024 * 1024} // 10MB
                folder="test-images"
              />
            </CardContent>
          </Card>

          {/* 3D Model Upload Test */}
          <Card>
            <CardHeader>
              <CardTitle>3D Model Upload Test</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUpload={handleUpload}
                onError={handleError}
                accept={{
                  'model/*': ['.glb', '.gltf'],
                  'application/octet-stream': ['.glb'],
                  'model/gltf+json': ['.gltf'],
                  'model/gltf-binary': ['.glb']
                }}
                maxFiles={2}
                maxSize={50 * 1024 * 1024} // 50MB
                folder="test-models"
              />
            </CardContent>
          </Card>

          {/* Mixed Upload Test */}
          <Card>
            <CardHeader>
              <CardTitle>Mixed Files Upload Test</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onUpload={handleUpload}
                onError={handleError}
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
                  'model/*': ['.glb', '.gltf', '.fbx', '.obj'],
                  'application/octet-stream': ['.glb', '.fbx'],
                  'model/gltf+json': ['.gltf'],
                  'model/gltf-binary': ['.glb']
                }}
                maxFiles={5}
                maxSize={50 * 1024 * 1024} // 50MB
                folder="test-mixed"
              />
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Image Upload Test:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Upload JPG, PNG, WebP, or GIF images</li>
                  <li>Maximum 3 files, 10MB each</li>
                  <li>Files will be stored in 'test-images' folder</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">3D Model Upload Test:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Upload GLB or GLTF 3D models</li>
                  <li>Maximum 2 files, 50MB each</li>
                  <li>Files will be stored in 'test-models' folder</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Mixed Upload Test:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Upload both images and 3D models</li>
                  <li>Maximum 5 files total, 50MB each</li>
                  <li>Files will be stored in 'test-mixed' folder</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Check browser console and network tab for detailed upload information.
                  Successful uploads will show toast notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}