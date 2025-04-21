import { getAuthSession } from '@/lib/auth'
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
  } catch (err) {
    console.error('❌ 사이트 삭제 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
