import React from 'react'
import { Environment, Grid } from '@react-three/drei'
import { EditorSettings } from './types'

function SceneEnvironment({ settings }: { settings: EditorSettings }) {
  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
      {settings.lightingMode === 'realistic' && (
        <>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        </>
      )}
      {settings.lightingMode === 'flat' && (
        <ambientLight intensity={1} />
      )}
      {settings.showGrid && (
        <Grid 
          position={[0, 0, 0]} 
          args={[20, 20]} 
          cellSize={settings.gridSize} 
          cellThickness={0.5} 
          cellColor="#6f6f6f" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#9d4b4b" 
          fadeDistance={25} 
          fadeStrength={1} 
        />
      )}
    </>
  )
}

export default SceneEnvironment 