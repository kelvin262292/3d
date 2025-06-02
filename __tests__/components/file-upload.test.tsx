import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from '../../components/file-upload'

// Mock react-dropzone
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(() => ({
    getRootProps: () => ({ 'data-testid': 'dropzone' }),
    getInputProps: () => ({ 'data-testid': 'file-input' }),
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
  })),
}))

// Mock fetch
global.fetch = jest.fn()

describe('FileUpload Component', () => {
  const mockOnUpload = jest.fn()
  const defaultProps = {
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'test',
    type: 'image' as const,
    onUpload: mockOnUpload,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          url: 'https://example.com/image.jpg',
          publicId: 'test/image',
          originalName: 'image.jpg',
          size: 1024,
        },
      }),
    })
  })

  it('renders file upload component', () => {
    render(<FileUpload {...defaultProps} />)
    
    expect(screen.getByTestId('dropzone')).toBeInTheDocument()
    expect(screen.getByText('Kéo thả file vào đây hoặc click để chọn')).toBeInTheDocument()
    expect(screen.getByText('Hỗ trợ: PNG, JPG, JPEG')).toBeInTheDocument()
    expect(screen.getByText('Tối đa 5 files, mỗi file tối đa 10MB')).toBeInTheDocument()
  })

  it('displays correct file type restrictions', () => {
    const modelProps = {
      ...defaultProps,
      accept: { 'model/*': ['.glb', '.gltf', '.obj'] },
      type: 'model' as const,
    }
    
    render(<FileUpload {...modelProps} />)
    
    expect(screen.getByText('Hỗ trợ: GLB, GLTF, OBJ')).toBeInTheDocument()
  })

  it('shows upload button when files are selected', async () => {
    const { useDropzone } = require('react-dropzone')
    const mockFiles = [
      new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    ]
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      acceptedFiles: mockFiles,
    })

    render(<FileUpload {...defaultProps} />)
    
    // Simulate file selection
    const dropzone = screen.getByTestId('dropzone')
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: mockFiles,
      },
    })

    await waitFor(() => {
      expect(screen.getByText('Upload Files')).toBeInTheDocument()
    })
  })

  it('handles upload success', async () => {
    const user = userEvent.setup()
    
    render(<FileUpload {...defaultProps} />)
    
    // Mock file selection
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(fileInput, file)
    
    // Click upload button
    const uploadButton = screen.getByText('Upload Files')
    await user.click(uploadButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }))
      expect(mockOnUpload).toHaveBeenCalledWith(expect.objectContaining({
        url: 'https://example.com/image.jpg',
        publicId: 'test/image',
        originalName: 'image.jpg',
        size: 1024,
      }))
    })
  })

  it('handles upload error', async () => {
    const user = userEvent.setup()
    
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        success: false,
        error: 'Upload failed',
      }),
    })

    render(<FileUpload {...defaultProps} />)
    
    // Mock file selection and upload
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(fileInput, file)
    
    const uploadButton = screen.getByText('Upload Files')
    await user.click(uploadButton)

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument()
    })
  })

  it('removes files when remove button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<FileUpload {...defaultProps} />)
    
    // Mock file selection
    const fileInput = screen.getByTestId('file-input')
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    await user.upload(fileInput, file)
    
    // Find and click remove button
    const removeButton = screen.getByLabelText('Remove file')
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument()
    })
  })

  it('shows drag active state', () => {
    const { useDropzone } = require('react-dropzone')
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: true,
      isDragAccept: true,
      isDragReject: false,
    })

    render(<FileUpload {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('border-blue-500')
  })

  it('shows drag reject state', () => {
    const { useDropzone } = require('react-dropzone')
    
    useDropzone.mockReturnValue({
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'file-input' }),
      isDragActive: true,
      isDragAccept: false,
      isDragReject: true,
    })

    render(<FileUpload {...defaultProps} />)
    
    const dropzone = screen.getByTestId('dropzone')
    expect(dropzone).toHaveClass('border-red-500')
  })
})