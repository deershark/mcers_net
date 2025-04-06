'use client';

import { useState } from 'react';
import { Input, Button, message, Card, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';

const WEB_DOMAIN = process.env.NEXT_PUBLIC_WEB_DOMAIN

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!playerName.trim()) {
      message.warning('请输入玩家名称');
      return;
    }
    router.push(`/${playerName}`);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-fade-in">
        <Card className="bg-[#2D2D2D] border-none">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-[#3B8526] mb-2 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 9h-2V7h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2z" />
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              </svg>
              Minecraft 玩家查询
            </h1>
            <p className="text-[#E0E0E0]">输入正版玩家名称获取详细游戏数据</p>
          </div>

          <div className="mt-6">
            <div className="flex gap-2">
              <Input
                size="large"
                placeholder="输入玩家昵称..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onPressEnter={handleSearch}
                style={{ 
                  color: '#E0E0E0',
                  caretColor: '#E0E0E0'
                }}
              />
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
              >
                立即查询
              </Button>
            </div>
            <div className="text-center text-sm text-[#A0A0A0] mt-2">
              支持Java版和Hypixel服务器正版玩家数据查询
            </div>
          </div>
        </Card>
        
        <div className='mt-2'>
          <Card className="bg-[#2D2D2D] border-none">
            <div className="flex items-center justify-center gap-3 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B8526]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <div className="text-[#E0E0E0]">
                使用 <span className="text-[#3B8526] font-medium">{WEB_DOMAIN}/{"<游戏昵称>"}</span> 可以快速查看玩家信息嗷~
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
