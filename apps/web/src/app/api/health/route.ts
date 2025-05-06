import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/shared/lib/logger'

export async function GET() {
  try {
    await db.user.findFirst({ select: { id: true }, take: 1 })

    return NextResponse.json({
      status: 'ok',
      db: true,
    })
  } catch (error) {
    logger.log('error', '🔴 /api/health failed:', { error })
    return NextResponse.json({ status: 'fail', error: String(error) }, { status: 500 })
  }
}
