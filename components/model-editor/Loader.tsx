import React from 'react'
import { Html } from '@react-three/drei'

function Loader({ progress = 0 }: { progress?: number }) {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div className="text-center">
          <p className="font-medium">Loading Editor</p>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </div>
      </div>
    </Html>
  )
}

export default Loader 