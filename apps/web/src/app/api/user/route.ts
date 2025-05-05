import { getAuthSession } from '@/lib/auth'
import logger from '@/lib/logger'
import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const { id } = await context.params

    const deleted = await db.site.update({
      where: {
        id,
        ...(userId && { userId }),
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json(deleted)
  } catch (error) {
    logger.log('error', '❌ Failed to delete site:', { error })
    return new NextResponse('Bad Request', { status: 400 })
  }
}
