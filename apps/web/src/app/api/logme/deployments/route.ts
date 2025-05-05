import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const deployment = await db.deployment.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(deployment)
  } catch (error) {
    logger.log('error', '❌ Failed to create deployment:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
