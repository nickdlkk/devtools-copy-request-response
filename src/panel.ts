// 确保正确导入React
import * as React from 'react';
// 确保使用正确的JSX命名空间
import { createRoot } from 'react-dom/client';
// 确保App是有效的React组件
import App from './App';

// 获取root元素
const container = document.getElementById('root');

// 确保container存在
if (container) {
  // 创建root
  const root = createRoot(container);
  
  // 渲染应用
  root.render(
    React.createElement(React.StrictMode, null,
      React.createElement(App, null)
    )
  );
} else {
  console.error('Failed to find the root element');
}