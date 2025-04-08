import { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import '@ant-design/v5-patch-for-react-19';
import ClientLayout from '../components/ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'Minecraft 玩家查询',
    template: '%s - Minecraft 玩家查询'
  },
  description: '快速查询Minecraft正版玩家游戏数据，支持Java版和Hypixel服务器，获取详细玩家信息。',
  keywords: ['Minecraft', '玩家查询', '正版玩家', 'Hypixel', 'Java版', '游戏数据'],
  authors: [{ name: 'Minecraft玩家查询团队' }],
  openGraph: {
    title: 'Minecraft 玩家查询',
    description: '快速查询Minecraft正版玩家游戏数据，支持Java版和Hypixel服务器，获取详细玩家信息。',
    type: 'website',
    locale: 'zh_CN'
  }
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN" className="minecraft-font">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
