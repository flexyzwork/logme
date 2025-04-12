import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
// import { getUserFromSession } from '@/lib/session/sessionStore'

// GET /api/logme/sites/[id] - 사이트 조회 (단건)
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const { id } = await context.params
  const site = await db.site.findFirst({
    where: { id },
  })

  if (!site) return new NextResponse('Not Found', { status: 404 })
  return NextResponse.json(site)
}

// PATCH /api/logme/sites/[id] - 사이트 수정
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    // const userId = session.user.id
    const { id } = await context.params
    const data = await req.json()

    const updated = await db.site.update({
      where: {
        id,
        // userId,
      },
      data,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('❌ 사이트 수정 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/sites/[id] - 사이트 삭제
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const { id } = await context.params

    const deleted = await db.site.delete({
      where: {
        id,
        userId,
      },
    })

    return NextResponse.json(deleted)
  } catch (err) {
    console.error('❌ 사이트 삭제 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
