'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, File, Image, Box } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileUploadProps {
  onUpload?: (files: UploadedFile[]) => void
  onError?: (error: string) => void
  accept?: {
    [key: string]: string[]
  }
  maxFiles?: number
  maxSize?: number
  folder?: string
  className?: string
}

interface UploadedFile {
  url: string
  public_id: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  fileName: string
  originalSize: number
}

interface FileWithPreview extends File {
  preview?: string
  progress?: number
  uploaded?: boolean
  error?: string
  result?: UploadedFile
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onError,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    'model/*': ['.glb', '.gltf', '.fbx', '.obj', '.blend']
  },
  maxFiles = 5,
  maxSize = 50 * 1024 * 1024, // 50MB
  folder,
  className
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        progress: 0,
        uploaded: false
      })
      return fileWithPreview
    })

    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
  }, [maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    onError: (error) => {
      toast.error(error.message)
      onError?.(error.message)
    }
  })

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    const uploadedFiles: UploadedFile[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.uploaded) continue

        // Update progress
        setFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = { ...newFiles[i], progress: 0 }
          return newFiles
        })

        const formData = new FormData()
        formData.append('file', file)
        if (folder) formData.append('folder', folder)
        
        const isImage = file.type.startsWith('image/')
        formData.append('type', isImage ? 'image' : 'model')

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Upload failed')
          }

          const result: UploadedFile = await response.json()
          uploadedFiles.push(result)

          // Update file as uploaded
          setFiles(prev => {
            const newFiles = [...prev]
            newFiles[i] = {
              ...newFiles[i],
              progress: 100,
              uploaded: true,
              result
            }
            return newFiles
          })

          toast.success(`${file.name} uploaded successfully`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Upload failed'
          
          setFiles(prev => {
            const newFiles = [...prev]
            newFiles[i] = {
              ...newFiles[i],
              error: errorMessage
            }
            return newFiles
          })

          toast.error(`Failed to upload ${file.name}: ${errorMessage}`)
          onError?.(errorMessage)
        }
      }

      if (uploadedFiles.length > 0) {
        onUpload?.(uploadedFiles)
      }
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />
    } else if (file.name.match(/\.(glb|gltf|fbx|obj|blend)$/i)) {
      return <Box className="w-8 h-8 text-purple-500" />
    }
    return <File className="w-8 h-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary/50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Support images and 3D models (max {maxFiles} files, {formatFileSize(maxSize)} each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    
                    {/* Progress Bar */}
                    {file.progress !== undefined && file.progress > 0 && (
                      <Progress value={file.progress} className="mt-1" />
                    )}
                    
                    {/* Status */}
                    {file.uploaded && (
                      <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                    )}
                    {file.error && (
                      <p className="text-xs text-red-600 mt-1">✗ {file.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={uploadFiles}
                disabled={uploading || files.every(f => f.uploaded)}
                className="min-w-[120px]"
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FileUpload
export type { UploadedFile, FileUploadProps }