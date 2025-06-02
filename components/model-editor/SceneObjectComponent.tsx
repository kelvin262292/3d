import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Box, Sphere, Plane, Cylinder, Cone, Torus, TransformControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { OptimizedModelLoader } from '@/lib/model-utils'
import { EditorSettings, SceneObject } from './types'

const defaultMaterial = {
  color: '#ffffff',
  metalness: 0,
  roughness: 0.5,
  opacity: 1,
  wireframe: false
}

function SceneObjectComponent({ 
  object, 
  isSelected, 
  onSelect, 
  onTransform,
  settings 
}: { 
  object: SceneObject
  isSelected: boolean
  onSelect: (id: string) => void
  onTransform: (id: string, transform: Partial<SceneObject>) => void
  settings: EditorSettings
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [model, setModel] = useState<any>(null)
  
  useEffect(() => {
    if (object.type === 'model' && object.modelUrl) {
      const loader = new OptimizedModelLoader()
      loader.load(object.modelUrl).then(setModel).catch(console.error)
    }
  }, [object.modelUrl, object.type])
  
  const handleTransform = useCallback(() => {
    if (meshRef.current) {
      const { position, rotation, scale } = meshRef.current
      onTransform(object.id, {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
        scale: [scale.x, scale.y, scale.z]
      })
    }
  }, [object.id, onTransform])
  
  if (!object.visible) return null
  
  const material = (
    <meshStandardMaterial
      color={object.material?.color || defaultMaterial.color}
      metalness={object.material?.metalness ?? defaultMaterial.metalness}
      roughness={object.material?.roughness ?? defaultMaterial.roughness}
      transparent={object.material?.opacity !== undefined && object.material.opacity < 1}
      opacity={object.material?.opacity ?? defaultMaterial.opacity}
      wireframe={object.material?.wireframe ?? (settings.renderMode === 'wireframe')}
    />
  )
  
  const renderPrimitive = () => {
    const geometry = object.geometry || {}
    
    switch (object.primitiveType) {
      case 'box':
        return (
          <Box
            ref={meshRef}
            args={[geometry.width || 1, geometry.height || 1, geometry.depth || 1]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Box>
        )
      case 'sphere':
        return (
          <Sphere
            ref={meshRef}
            args={[geometry.radius || 0.5, geometry.segments || 32, geometry.segments || 16]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Sphere>
        )
      case 'plane':
        return (
          <Plane
            ref={meshRef}
            args={[geometry.width || 1, geometry.height || 1]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Plane>
        )
      case 'cylinder':
        return (
          <Cylinder
            ref={meshRef}
            args={[geometry.radius || 0.5, geometry.radius || 0.5, geometry.height || 1, geometry.segments || 32]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Cylinder>
        )
      case 'cone':
        return (
          <Cone
            ref={meshRef}
            args={[geometry.radius || 0.5, geometry.height || 1, geometry.segments || 32]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Cone>
        )
      case 'torus':
        return (
          <Torus
            ref={meshRef}
            args={[geometry.radius || 0.5, (geometry.radius || 0.5) * 0.4, geometry.segments || 16, geometry.segments || 32]}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale}
            onClick={() => onSelect(object.id)}
            onPointerDown={handleTransform}
          >
            {material}
          </Torus>
        )
      default:
        return null
    }
  }
  
  const renderModel = () => {
    if (!model) return null
    
    return (
      <primitive
        ref={meshRef}
        object={model.scene.clone()}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={() => onSelect(object.id)}
        onPointerDown={handleTransform}
      />
    )
  }
  
  return (
    <group>
      {object.type === 'primitive' && renderPrimitive()}
      {object.type === 'model' && renderModel()}
      
      {isSelected && settings.showGizmos && (
        <TransformControls
          object={meshRef.current}
          mode={settings.transformMode}
          space={settings.transformSpace}
          onObjectChange={handleTransform}
        />
      )}
    </group>
  )
}

export default SceneObjectComponent 