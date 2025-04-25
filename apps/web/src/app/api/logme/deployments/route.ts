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
  } catch (err) {
    logger.log('error', '❌ 배포 생성 실패:', { err })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
