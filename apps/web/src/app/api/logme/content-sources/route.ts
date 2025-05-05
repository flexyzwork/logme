import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import logger from '@/lib/logger'

// POST /api/logme/contentSources - Create a new content source
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const contentSource = await db.contentSource.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(contentSource)
  } catch (error) {
    logger.log('error', '❌ Failed to create content source:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
