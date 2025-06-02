import { StagewiseToolbar } from '@stagewise/toolbar-next'

const stagewiseConfig = {
  plugins: [
    {
      name: '3d-model-store-plugin',
      description: 'Plugin hỗ trợ phát triển cửa hàng mô hình 3D',
      mcp: {
        name: '3d-model-store-mcp',
        description: 'MCP cho cửa hàng mô hình 3D',
        version: '1.0.0'
      },
      actions: [
        {
          name: 'Reload Page',
          description: 'Tải lại trang hiện tại',
          execute: () => window.location.reload()
        },
        {
          name: 'Toggle Dev Tools',
          description: 'Mở Developer Tools',
          execute: () => {
            if (window.__STAGEWISE_DEVTOOLS__) {
              window.__STAGEWISE_DEVTOOLS__.toggle()
            }
          }
        },
        {
          name: 'Clear Cache',
          description: 'Xóa cache của ứng dụng',
          execute: () => {
            if ('caches' in window) {
              caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key))
              })
            }
          }
        }
      ],
    },
  ],
}

export function StagewiseDevTool() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <StagewiseToolbar config={stagewiseConfig} />
} 