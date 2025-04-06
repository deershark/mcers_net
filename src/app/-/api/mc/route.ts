import { NextResponse } from 'next/server'
import { Buffer } from 'buffer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')
  const uuid = searchParams.get('uuid')

  try {
    let url: string
    if (uuid) {
      url = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
    } else if (username) {
      url = `https://api.mojang.com/users/profiles/minecraft/${username}`
    } else {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    const profile = await res.json()
    
    // Decode textures property
    if (profile.properties && profile.properties.length > 0) {
      const textures = JSON.parse(Buffer.from(profile.properties[0].value, 'base64').toString())
      profile.textures = textures
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to fetch Minecraft data' }, { status: 500 })
  }
}
