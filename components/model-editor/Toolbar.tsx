import React, { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Undo, Redo, Save, Upload, Download, Copy, Trash2, Move3D, RotateCw, Scale, Grid3X3, Settings, Layers } from 'lucide-react'

interface ToolbarProps {
  saveScene: () => void
  loadScene: () => void
  exportScene: () => void
  importScene: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: RefObject<HTMLInputElement>
  undo: () => void
  redo: () => void
  historyIndex: number
  historyLength: number
  settings: any
  updateSetting: (key: string, value: any) => void
  duplicateSelected: () => void
  deleteSelected: () => void
  selectedObjects: string[]
  showHierarchy: boolean
  setShowHierarchy: (show: boolean) => void
  showProperties: boolean
  setShowProperties: (show: boolean) => void
}

function Toolbar({
  saveScene,
  loadScene,
  exportScene,
  importScene,
  fileInputRef,
  undo,
  redo,
  historyIndex,
  historyLength,
  settings,
  updateSetting,
  duplicateSelected,
  deleteSelected,
  selectedObjects,
  showHierarchy,
  setShowHierarchy,
  showProperties,
  setShowProperties
}: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* File Operations */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button variant="outline" size="sm" onClick={saveScene}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={loadScene}>
              <Upload className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportScene}>
              <Download className="w-4 h-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importScene}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {/* History */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={undo}
              disabled={historyIndex === 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={redo}
              disabled={historyIndex === historyLength - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          {/* Transform Tools */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button
              variant={settings.transformMode === 'translate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('transformMode', 'translate')}
            >
              <Move3D className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.transformMode === 'rotate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('transformMode', 'rotate')}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.transformMode === 'scale' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('transformMode', 'scale')}
            >
              <Scale className="w-4 h-4" />
            </Button>
          </div>
          {/* Object Operations */}
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={duplicateSelected}
              disabled={selectedObjects.length === 0}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deleteSelected}
              disabled={selectedObjects.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Options */}
          <div className="flex items-center gap-1">
            <Button
              variant={settings.showGrid ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('showGrid', !settings.showGrid)}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={settings.showStats ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('showStats', !settings.showStats)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          {/* Panel Toggles */}
          <div className="flex items-center gap-1">
            <Button
              variant={showHierarchy ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowHierarchy(!showHierarchy)}
            >
              <Layers className="w-4 h-4" />
            </Button>
            <Button
              variant={showProperties ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowProperties(!showProperties)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Toolbar 