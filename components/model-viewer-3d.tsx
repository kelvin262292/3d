// Thêm skeleton loading
function ModelSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg w-64 h-64" />
        <div className="mt-4 w-48 h-4 bg-gray-200 rounded mx-auto" />
      </div>
    </div>
  )
}

// Trong component chính
export function ModelViewer3D({ ...props }) {
  // ... existing code
  
  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* ... existing code */}
      
      <Canvas>
        <Suspense fallback={<ModelSkeleton />}>
          <Model ... />
        </Suspense>
      </Canvas>
    </div>
  )
}
