import { NextResponse } from 'next/server'
import { db } from '@repo/db'

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
  } catch (err) {
    console.error('🔴 Failed to track event:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
