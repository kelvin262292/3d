import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

// Cấu hình toolbar
const stagewiseConfig = {
  plugins: []
};

// Khởi tạo ứng dụng
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render ứng dụng chính
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Chỉ thêm toolbar trong môi trường development
if (process.env.NODE_ENV === 'development') {
  const toolbarRoot = document.createElement('div');
  toolbarRoot.id = 'stagewise-toolbar-root';
  document.body.appendChild(toolbarRoot);
  
  const toolbarContainer = ReactDOM.createRoot(toolbarRoot);
  toolbarContainer.render(
    <React.StrictMode>
      <StagewiseToolbar config={stagewiseConfig} />
    </React.StrictMode>
  );
}
