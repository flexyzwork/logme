import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

// POST /api/logme/repos - 레포 생성
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const repo = await db.repo.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(repo)
  } catch (err) {
    logger.log('error', '❌ 레포 생성 실패:', { err })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
