import { NextResponse } from 'next/server'

const HYPIXEL_API_KEY = process.env.HYPIXEL_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uuid = searchParams.get('uuid')

  if (!HYPIXEL_API_KEY) {
    return NextResponse.json({ error: 'Hypixel API key not configured' }, { status: 500 })
  }

  try {
    const url = `https://api.hypixel.net/v2/player?uuid=${uuid}&key=${HYPIXEL_API_KEY}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch Hypixel data')
    }

    const data = await res.json()
    
    if (!data.success) {
      throw new Error(data.cause || 'Hypixel API error')
    }

    return NextResponse.json(data.player)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Hypixel data' }, { status: 500 })
  }
}
