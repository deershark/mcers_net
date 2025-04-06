'use client';

import { ConfigProvider, App } from 'antd';
import type { ReactNode } from 'react';
import './globals.css';
import '@ant-design/v5-patch-for-react-19';

const theme = {
  token: {
    colorPrimary: '#3B8526', // Minecraft深绿色
    borderRadius: 0,         // 方块化直角
    fontFamily: "-apple-system, sans-serif",
    colorBgContainer: '#1E1E1E',
    colorText: '#E0E0E0'
  },
  components: {
    Button: {
      borderRadiusLG: 0,
      controlHeightLG: 40
    },
    Card: {
      borderRadiusLG: 0,
      colorBgContainer: '#2D2D2D'
    }
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="minecraft-font">
      <body>
        <ConfigProvider theme={theme}>
          <App>
            {children}
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
