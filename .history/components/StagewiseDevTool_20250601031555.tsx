import { StagewiseToolbar } from '@stagewise/toolbar-next'

const stagewiseConfig = {
  plugins: [
    {
      name: '3d-model-store-plugin',
      description: 'Plugin hỗ trợ phát triển cửa hàng mô hình 3D',
      mcp: null,
      actions: [],
    },
  ],
}

export function StagewiseDevTool() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <StagewiseToolbar config={stagewiseConfig} />
} 