import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

// POST /api/logme/deployTarget - 배포 프로젝트 생성
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const deployTarget = await db.deployTarget.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(deployTarget)
  } catch (err) {
    logger.log('error', '❌ 배포 프로젝트 생성 실패:', { err })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
