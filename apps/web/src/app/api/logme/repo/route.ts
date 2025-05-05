import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

// POST /api/logme/repos - Create a new repository
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const repo = await db.repo.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(repo)
  } catch (error) {
    logger.log('error', '❌ Failed to create repository:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
