import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

// POST /api/logme/deployTarget - Create a new deploy target
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const deployTarget = await db.deployTarget.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(deployTarget)
  } catch (error) {
    logger.log('error', '❌ Failed to create deploy target:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
