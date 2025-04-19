import { NextResponse } from 'next/server'
import { db } from '@repo/db'
// import { redis } from '@repo/queue'
import { sendAlert } from '@/lib/server/alert'

export async function GET() {
  try {
    // DB 체크
    await db.user.findFirst({ select: { id: true }, take: 1 })

    // Redis 체크
    // await redis.ping()

    return NextResponse.json({
      status: 'ok',
      db: true,
    //   redis: true,
    })
  } catch (error) {
    console.error('🔴 /api/health failed:', error)
    await sendAlert({
      type: 'error',
      message: '/api/health 실패',
      meta: { error: String(error) },
    })
    return NextResponse.json({ status: 'fail', error: String(error) }, { status: 500 })
  }
}
