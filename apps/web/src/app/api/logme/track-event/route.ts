import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const { userId, event, meta } = await req.json()

    await db.eventLog.create({
      data: {
        userId,
        event,
        meta,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.log('error', '🔴 Failed to track event:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
