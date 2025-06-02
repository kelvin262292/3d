import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Box as BoxIcon, Circle, Triangle, Eye, EyeOff, Lock, Unlock } from 'lucide-react'
import { SceneObject } from './types'

interface HierarchyPanelProps {
  scene: SceneObject[]
  selectedObjects: string[]
  selectObject: (id: string) => void
  updateObject: (id: string, updates: Partial<SceneObject>) => void
  addPrimitive: (primitiveType: SceneObject['primitiveType']) => void
}

function HierarchyPanel({ scene, selectedObjects, selectObject, updateObject, addPrimitive }: HierarchyPanelProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-sm">Scene Hierarchy</h3>
        <div className="flex gap-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPrimitive('box')}
            title="Add Box"
          >
            <BoxIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPrimitive('sphere')}
            title="Add Sphere"
          >
            <Circle className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addPrimitive('plane')}
            title="Add Plane"
          >
            <Triangle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {scene.map(object => (
            <div
              key={object.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedObjects.includes(object.id) ? 'bg-blue-100 border border-blue-300' : ''
              }`}
              onClick={() => selectObject(object.id)}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation()
                  updateObject(object.id, { visible: !object.visible })
                }}
                className="p-0 h-auto"
              >
                {object.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation()
                  updateObject(object.id, { locked: !object.locked })
                }}
                className="p-0 h-auto"
              >
                {object.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </Button>
              <span className="flex-1 text-sm truncate">{object.name}</span>
              <Badge variant="outline" className="text-xs">
                {object.type}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default HierarchyPanel 