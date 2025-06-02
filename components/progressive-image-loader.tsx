'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface ProgressiveImageLoaderProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholderSrc?: string
  quality?: number
  priority?: boolean
  lazy?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  sizes?: string
  fill?: boolean
}

interface ImageState {
  isLoading: boolean
  isLoaded: boolean
  hasError: boolean
  currentSrc: string
}

export function ProgressiveImageLoader({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc,
  quality = 75,
  priority = false,
  lazy = true,
  onLoad,
  onError,
  sizes,
  fill = false
}: ProgressiveImageLoaderProps) {
  const [imageState, setImageState] = useState<ImageState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    currentSrc: placeholderSrc || ''
  })
  
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Intersection observer for lazy loading
  const { isIntersecting } = useIntersectionObserver({
    elementRef: containerRef,
    threshold: 0.1,
    rootMargin: '50px',
    freezeOnceVisible: true
  })
  
  // Trigger loading when image becomes visible
  useEffect(() => {
    if (lazy && isIntersecting && !shouldLoad) {
      setShouldLoad(true)
    }
  }, [lazy, isIntersecting, shouldLoad])
  
  // Generate responsive image sources
  const generateSrcSet = useCallback((baseSrc: string) => {
    if (!baseSrc) return ''
    
    const sizes = [640, 768, 1024, 1280, 1920]
    return sizes
      .map(size => {
        // Assuming Next.js image optimization
        const optimizedSrc = `${baseSrc}?w=${size}&q=${quality}`
        return `${optimizedSrc} ${size}w`
      })
      .join(', ')
  }, [quality])
  
  // Handle image load success
  const handleLoad = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: true,
      hasError: false
    }))
    onLoad?.()
  }, [onLoad])
  
  // Handle image load error
  const handleError = useCallback(() => {
    const error = new Error(`Failed to load image: ${src}`)
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: false,
      hasError: true
    }))
    onError?.(error)
  }, [src, onError])
  
  // Retry loading
  const retryLoad = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false
    }))
    setShouldLoad(true)
  }, [])
  
  // Progressive loading effect
  useEffect(() => {
    if (!shouldLoad) return
    
    // Start with placeholder if available
    if (placeholderSrc && !imageState.currentSrc) {
      setImageState(prev => ({
        ...prev,
        currentSrc: placeholderSrc
      }))
    }
    
    // Preload the main image
    const img = new window.Image()
    img.onload = () => {
      setImageState(prev => ({
        ...prev,
        currentSrc: src,
        isLoading: false,
        isLoaded: true,
        hasError: false
      }))
      onLoad?.()
    }
    img.onerror = () => {
      handleError()
    }
    img.src = src
    
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [shouldLoad, src, placeholderSrc, imageState.currentSrc, onLoad, handleError])
  
  // Render loading skeleton
  if (!shouldLoad || (imageState.isLoading && !imageState.currentSrc)) {
    return (
      <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
        <Skeleton 
          className={cn(
            'w-full h-full',
            fill ? 'absolute inset-0' : '',
            width && height ? '' : 'aspect-square'
          )}
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height
          }}
        />
        {!shouldLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs">Image will load when visible</p>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Render error state
  if (imageState.hasError) {
    return (
      <div ref={containerRef} className={cn('relative overflow-hidden bg-gray-100', className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 p-4">
            <svg className="w-8 h-8 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs mb-2">Failed to load image</p>
            <button 
              onClick={retryLoad}
              className="text-xs text-blue-500 hover:text-blue-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // Render the image
  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      {fill ? (
        <Image
          src={imageState.currentSrc}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            imageState.isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          quality={quality}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          src={imageState.currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-300',
            imageState.isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          quality={quality}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Loading overlay */}
      {imageState.isLoading && imageState.currentSrc && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

export default ProgressiveImageLoader