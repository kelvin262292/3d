# Upload API Documentation

## Overview
The Upload API provides endpoints for uploading files (images and 3D models) to Cloudinary with proper validation and error handling.

## Base URL
```
/api/upload
```

## Authentication
- **Required**: Yes (for POST requests)
- **Type**: NextAuth session
- **Note**: GET requests are public for guidelines

## Endpoints

### GET /api/upload
Retrieve upload guidelines and configuration status.

#### Response
```json
{
  "success": true,
  "data": {
    "guidelines": {
      "allowedTypes": [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "model/gltf-binary",
        "model/gltf+json",
        "application/octet-stream"
      ],
      "allowedExtensions": [
        ".jpg", ".jpeg", ".png", ".webp", ".gif",
        ".glb", ".gltf", ".obj", ".fbx", ".dae"
      ],
      "maxSize": 52428800,
      "maxFiles": 10,
      "folders": [
        "products",
        "categories", 
        "users",
        "temp",
        "test"
      ]
    },
    "endpoints": {
      "upload": "/api/upload",
      "delete": "/api/upload/delete",
      "test": "/test-upload"
    },
    "cloudinary": {
      "configured": true,
      "mockMode": false
    }
  }
}
```

### POST /api/upload
Upload a single file to Cloudinary.

#### Request
**Content-Type**: `multipart/form-data`

**Form Data**:
- `file` (File, required): The file to upload
- `folder` (string, required): Target folder (products, categories, users, temp, test)
- `type` (string, required): File type (image, model)

#### Example Request
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('folder', 'products')
formData.append('type', 'image')

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/products/sample.jpg",
    "publicId": "products/sample",
    "originalName": "sample.jpg",
    "size": 1024576,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "mockMode": false
  }
}
```

#### Error Responses

**400 Bad Request - No file provided**
```json
{
  "success": false,
  "error": "No file provided"
}
```

**400 Bad Request - Invalid file type**
```json
{
  "success": false,
  "error": "Invalid file type. Allowed types: image/jpeg, image/png, ..."
}
```

**400 Bad Request - File too large**
```json
{
  "success": false,
  "error": "File size too large. Maximum size: 50MB"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Upload failed: [error details]"
}
```

## File Type Support

### Images
- **MIME Types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- **Extensions**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- **Max Size**: 50MB
- **Cloudinary Resource Type**: `image`

### 3D Models
- **MIME Types**: `model/gltf-binary`, `model/gltf+json`, `application/octet-stream`
- **Extensions**: `.glb`, `.gltf`, `.obj`, `.fbx`, `.dae`
- **Max Size**: 50MB
- **Cloudinary Resource Type**: `raw`

## Folders

- **products**: Product images and 3D models
- **categories**: Category images
- **users**: User avatars and profile images
- **temp**: Temporary uploads
- **test**: Test uploads (for development)

## Mock Mode

When Cloudinary is not properly configured, the API automatically falls back to mock mode:

- Returns simulated upload responses
- Useful for development and testing
- Indicated by `mockMode: true` in responses

## Rate Limiting

- **Limit**: 100 requests per hour per IP
- **Headers**: Rate limit info included in response headers

## Security Features

- File type validation
- File size limits
- Authentication required
- Secure file naming
- Virus scanning (via Cloudinary)

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE" // Optional
}
```

## Testing

Use the test page at `/test-upload` to test upload functionality with different file types and configurations.

## Examples

### Upload Product Image
```javascript
const uploadProductImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'products')
  formData.append('type', 'image')
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log('Upload successful:', result.data.url)
    return result.data
  } else {
    console.error('Upload failed:', result.error)
    throw new Error(result.error)
  }
}
```

### Upload 3D Model
```javascript
const upload3DModel = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'products')
  formData.append('type', 'model')
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error)
    }
    
    return result.data
  } catch (error) {
    console.error('3D model upload failed:', error)
    throw error
  }
}
```

### Check Upload Guidelines
```javascript
const getUploadGuidelines = async () => {
  const response = await fetch('/api/upload')
  const result = await response.json()
  
  if (result.success) {
    return result.data.guidelines
  }
  
  throw new Error('Failed to get upload guidelines')
}
```