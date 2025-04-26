import { NextRequest, NextResponse } from 'next/server'

const BETTERSTACK_ENDPOINT = process.env.BETTERSTACK_ENDPOINT!
const TOKEN = process.env.BETTERSTACK_TOKEN

if (!TOKEN) {
  throw new Error('BETTERSTACK_TOKEN is not defined in environment variables')
}

export async function POST(req: NextRequest) {
  const { level = 'info', message, meta } = await req.json()

  try {
    const response = await fetch(BETTERSTACK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        dt: new Date().toISOString(),
        message: `[${level.toUpperCase()}] ${message}`,
        meta: meta || {},
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('BetterStack 전송 실패:', errorText)
      return NextResponse.json({ status: 'error', error: errorText }, { status: response.status })
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('BetterStack 통신 오류:', error)
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 500 })
  }
}
