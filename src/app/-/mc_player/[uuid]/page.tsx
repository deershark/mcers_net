import { Metadata } from 'next'
import ClientPage from './client-page'

async function getPlayerName(uuid: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/-/api/mc?uuid=${uuid}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch player data: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.name || '';
  } catch (error) {
    console.error('Error fetching player name:', error);
    return '';
  }
}

export async function generateMetadata({ params }: { params: { uuid: string } }): Promise<Metadata> {
  const { uuid } = await params;
  const playerName = await getPlayerName(uuid);
  
  return {
    title: `玩家信息 - ${playerName || '未知玩家'}`,
    description: `查看${playerName || '未知玩家'}的Minecraft玩家信息`,
    openGraph: {
      title: `玩家信息 - ${playerName || '未知玩家'}`,
      description: `查看${playerName || '未知玩家'}的Minecraft玩家信息`,
    },
  }
}

export default function Page({ params }: { params: { uuid: string } }) {
  return <ClientPage params={Promise.resolve(params)} />
}
