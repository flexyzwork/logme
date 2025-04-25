import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
import logger from '@/lib/logger'

// GET /api/logme/contentSources/[id] - 컨텐츠 소스 조회 (단건)
export async function GET(req: NextRequest, context: { params: Promise<{ sourceId: string }> }) {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { sourceId } = await context.params

  const contentSource = await db.contentSource.findFirst({
    where: { sourceId },
  })

  if (!contentSource) return new NextResponse('Not Found', { status: 404 })
  return NextResponse.json(contentSource)
}

// PATCH /api/logme/contentSources/[id] - 컨텐츠 소스 수정
export async function PATCH(req: NextRequest, context: { params: Promise<{ sourceId: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { sourceId } = await context.params

    const data = await req.json()

    const updated = await db.contentSource.update({
      where: { sourceId },
      data,
    })

    return NextResponse.json(updated)
  } catch (err) {
    logger.log('error', '❌ 컨텐츠 소스 수정 실패:', {err})
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/contentSources/[id] - 컨텐츠 소스 삭제
export async function DELETE(req: NextRequest, context: { params: Promise<{ sourceId: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { sourceId } = await context.params
    const deleted = await db.contentSource.delete({
      where: {
        sourceId,
      },
    })

    return NextResponse.json(deleted)
  } catch (err) {
    logger.log('error', '❌ 컨텐츠 소스 삭제 실패:', {err})
    return new NextResponse('Bad Request', { status: 400 })
  }
}
