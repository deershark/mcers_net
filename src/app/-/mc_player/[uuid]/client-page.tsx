'use client'
import { useEffect, useState, useRef } from 'react'
import React from 'react'
import { Card, Spin, message, Button, App } from 'antd'
import { useRouter } from 'next/navigation'
import { SkinViewer, WalkingAnimation } from 'skinview3d'
import { useTranslation } from 'react-i18next'

const WEB_DOMAIN = process.env.NEXT_PUBLIC_WEB_DOMAIN

interface PlayerData {
  id: string
  name: string
  properties: {
    value: string
  }[]
  networkExp: number
  firstLogin?: number
  lastLogin?: number
  stats?: {
    bedwars?: {
      wins?: number
      losses?: number
      final_kills?: number
    }
    skywars?: {
      wins?: number
      losses?: number
      kills?: number
    }
  }
  achievements?: {
    [key: string]: number
  }
  newPackageRank?: string
  karma?: number
  level?: number
  achievementPoints?: number
  quests?: {
    [key: string]: {
      completions: number
    }
  }
  challenges?: {
    [key: string]: number
  }
}

interface SkinData {
  textures: {
    SKIN: {
      url: string
    }
    CAPE?: {
      url: string
    }
  }
}

function calculateExpression(EXP?: number): string {
  if (EXP == undefined) {
    return "0"
  }
  const numerator = Math.sqrt(EXP + 15312.5) - (125 / Math.sqrt(2));
  const denominator = 25 * Math.sqrt(2);
  return (numerator / denominator).toFixed(2);
}

export default function ClientPage({ params: paramsPromise }: { params: Promise<{ uuid: string }> }) {
  const { t } = useTranslation()
  const params = React.use(paramsPromise)
  const viewerContainerRef = useRef<HTMLCanvasElement>(null)
  const skinViewerRef = useRef<SkinViewer | null>(null)
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!params.uuid) return

    const fetchPlayerData = async () => {
      try {
        const [mcRes, hypixelRes] = await Promise.all([
          fetch(`/-/api/mc?uuid=${params.uuid}`),
          fetch(`/-/api/hypixel?uuid=${params.uuid}`)
        ])

        if (!mcRes.ok) throw new Error('Failed to fetch Minecraft data')
        if (!hypixelRes.ok) throw new Error('Failed to fetch Hypixel data')

        const mcData = await mcRes.json()
        const hypixelData = await hypixelRes.json()

        setPlayerData({
          ...mcData,
          ...hypixelData
        })
      } catch (error) {
        console.log(error)
        message.error('无法获取玩家信息')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [params?.uuid, router])

  useEffect(() => {
    if (!playerData) return

    // 解析皮肤数据
    const skinData = JSON.parse(
      Buffer.from(playerData.properties[0].value, 'base64').toString()
    ) as SkinData

    const container = viewerContainerRef.current
    if (!container) return

    // 初始化皮肤查看器
    const viewer = new SkinViewer({
      canvas: container,
      width: 300,
      height: 500,
      skin: skinData.textures.SKIN.url,
      cape: skinData.textures.CAPE?.url
    })
    skinViewerRef.current = viewer

    // 设置动画
    viewer.animation = new WalkingAnimation()

    return () => {
      viewer.dispose()
    }
  }, [playerData])

  const handleDownloadSkin = () => {
    if (!playerData) return

    const skinData = JSON.parse(
      Buffer.from(playerData.properties[0].value, 'base64').toString()
    ) as SkinData

    const link = document.createElement('a')
    link.href = skinData.textures.SKIN.url
    link.download = `${playerData.name}_skin.png`
    link.click()
  }

  const handleDownloadCape = () => {
    if (!playerData) return

    const skinData = JSON.parse(
      Buffer.from(playerData.properties[0].value, 'base64').toString()
    ) as SkinData

    if (!skinData.textures.CAPE) {
      message.warning('该玩家没有披风')
      return
    }

    const link = document.createElement('a')
    link.href = skinData.textures.CAPE.url
    link.download = `${playerData.name}_cape.png`
    link.click()
  }

  return (
    <>
      <App>
      <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center p-8">
        <div className="max-w-4xl w-full space-y-6 animate-fade-in">
          <div className="mt-2">
            <Spin spinning={loading} tip="加载中..." size="large">
              <Card className="bg-[#2D2D2D] border-none shadow-lg my-4">
              <div className="bg-[#3B8526] p-6 rounded-t-lg">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                    <path d="M13 7h-2v5h2V7zm0 6h-2v2h2v-2z" />
                  </svg>
                  {t('playerInfo.title', { name: playerData?.name })}
                </h1>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="mt-2">
                      <Card className="bg-[#2D2D2D] border-none my-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-[#3B8526] mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            {t('playerInfo.basicInfo')}
                          </h3>
                          <dl className="space-y-2 text-[#E0E0E0]">
                            <div className="flex justify-between">
                              <dt>{t('playerInfo.playerId')}</dt>
                              <dd className="font-mono">{params.uuid}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>{t('playerInfo.playerInfo')}</dt>
                              <dd>
                                <a
                                  href={`http://${WEB_DOMAIN}/${playerData?.name}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(`http://${WEB_DOMAIN}/${playerData?.name}`);
                                    message.success('链接已复制');
                                  }}
                                  className="text-[#3B8526] hover:text-[#2D6A1E] cursor-pointer"
                                >
                                  {WEB_DOMAIN}/{playerData?.name}
                                </a>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </Card>
                    </div>

                    <div className="mt-2">
                      <Card className="bg-[#2D2D2D] border-none my-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-[#3B8526] mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            {t('playerInfo.skinInfo')}
                          </h3>
                          <div className="relative group">
                            <canvas
                              ref={viewerContainerRef}
                              className="w-full h-96 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                              <Button
                                type="primary"
                                size="large"
                                onClick={handleDownloadSkin}
                                className="bg-[#3B8526] hover:bg-[#2D6A1E]"
                              >
                                {t('playerInfo.downloadSkin')}
                              </Button>
                              <Button
                                type="primary"
                                size="large"
                                onClick={handleDownloadCape}
                                className="bg-[#3B8526] hover:bg-[#2D6A1E]"
                              >
                                {t('playerInfo.downloadCape')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="mt-2">
                      <Card className="bg-[#2D2D2D] border-none my-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-[#3B8526] mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {t('playerInfo.achievements')}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-[#3B8526] border-none">
                              <div className="text-center p-3">
                                <div className="text-2xl font-bold text-white">
                                  {playerData?.achievements ? Object.keys(playerData.achievements).length : 0}
                                </div>
                                <div className="text-sm text-[#E0E0E0]">{t('playerInfo.totalAchievements')}</div>
                              </div>
                            </Card>
                            <Card className="bg-[#3B8526] border-none">
                              <div className="text-center p-3">
                                <div className="text-2xl font-bold text-white">
                                  {playerData?.achievementPoints || 0}
                                </div>
                                <div className="text-sm text-[#E0E0E0]">{t('playerInfo.achievementPoints')}</div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="mt-2">
                      <Card className="bg-[#2D2D2D] border-none my-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-[#3B8526] mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                            </svg>
                            {t('playerInfo.serverData')}
                          </h3>
                          <div className="space-y-3">
                            <Card className="bg-[#3B8526] border-none">
                              <div className="flex items-center justify-between p-3">
                                <span className="text-[#E0E0E0]">{t('playerInfo.userType')}</span>
                                <span className="font-semibold text-white">
                                  {playerData?.newPackageRank === 'VIP' ? 'VIP' :
                                    playerData?.newPackageRank === 'VIP_PLUS' ? 'VIP+' :
                                      playerData?.newPackageRank === 'MVP' ? 'MVP' :
                                        playerData?.newPackageRank === 'MVP_PLUS' ? 'MVP+' : '普通用户'}
                                </span>
                              </div>
                            </Card>
                            <Card className="bg-[#3B8526] border-none">
                              <div className="flex items-center justify-between p-3">
                                <span className="text-[#E0E0E0]">{t('playerInfo.lobbyLevel')}</span>
                                <span className="font-semibold text-white">{calculateExpression(playerData?.networkExp)}</span>
                              </div>
                            </Card>
                            <Card className="bg-[#3B8526] border-none">
                              <div className="flex items-center justify-between p-3">
                                <span className="text-[#E0E0E0]">{t('playerInfo.karma')}</span>
                                <span className="font-semibold text-white">{playerData?.karma || 0}</span>
                              </div>
                            </Card>
                            <Card className="bg-[#3B8526] border-none">
                              <div className="flex items-center justify-between p-3">
                                <span className="text-[#E0E0E0]">{t('playerInfo.registrationTime')}</span>
                                <span className="font-semibold text-white">{playerData?.firstLogin ? new Date(playerData.firstLogin).toLocaleDateString() : '未知'}</span>
                              </div>
                            </Card>
                            <Card className="bg-[#3B8526] border-none">
                              <div className="flex items-center justify-between p-3">
                                <span className="text-[#E0E0E0]">{t('playerInfo.lastLogin')}</span>
                                <span className="font-semibold text-white">{playerData?.lastLogin ? new Date(playerData.lastLogin).toLocaleDateString() : '未知'}</span>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </Spin>
          </div>
        </div>
      </div>
    </App>
    </>
  );
}
