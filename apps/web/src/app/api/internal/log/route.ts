import { NextRequest, NextResponse } from 'next/server'
// import axios from 'axios'

const NEXT_PUBLIC_BETTER_STACK_INGESTING_URL = process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_URL!
const TOKEN = process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN

if (!TOKEN) {
  throw new Error('NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN is not defined in environment variables')
}

export async function POST(req: NextRequest) {
  const { type = 'info', message, meta } = await req.json()

  try {
    const response = await fetch(NEXT_PUBLIC_BETTER_STACK_INGESTING_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        level: type,
        dt: new Date().toISOString(),
        message,
        meta: meta || {},
      }),
    })

    console.log('BetterStack 응답:', response.status, await response.text())

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

// import { ServerBetterStackStrategy } from '@/lib/logger/strategies/better-stack/ServerBetterStackStrategy'

// const betterStackLogger = new ServerBetterStackStrategy()

// export async function POST(req: Request) {
//   const { type, message, meta } = await req.json()
//   await betterStackLogger.log(type, message, meta)
//   return new Response('ok')
// }
