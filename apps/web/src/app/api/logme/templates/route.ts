import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
import logger from '@/lib/logger'

export async function GET() {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const templates = await db.template.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        templateTitle: true,
        templateDescription: true,
        thumbnailUrl: true,
        templateApp: {
          select: {
            id: true,
            appClientId: true,
            appRedirectUri: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(templates)
  } catch (error) {
    logger.log('error', '❌ Failed to fetch template list:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
