'use client'
import { useEffect } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { App, message } from 'antd'

export default function Page({ params: paramsPromise }: { params: Promise<{ player_name: string }> }) {
  const router = useRouter()
  const params = React.use(paramsPromise)

  useEffect(() => {
    if (!params.player_name) return
    
    const fetchUUID = async () => {
      try {
        const res = await fetch(`/-/api/mc?username=${params.player_name}`)
        if (!res.ok) throw new Error('Failed to fetch UUID')
        
        const data = await res.json()
        if (data.id) {
          router.replace(`/-/mc_player/${data.id}`)
        } else {
          throw new Error('Player not found')
        }
      } catch (error) {
        message.error(`无法找到该玩家: ${params.player_name}`)
        router.push('/')
      }
    }

    fetchUUID()
  }, [params?.player_name, router])

  return (
    <App></App>
  )
}
