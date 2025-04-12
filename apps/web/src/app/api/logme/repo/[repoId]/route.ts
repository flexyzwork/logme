import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
// import { getUserFromSession } from '@/lib/session/sessionStore'

// GET /api/logme/repos/[repoId] - 레포 조회 (단건)
export async function GET(req: NextRequest, context: { params: Promise<{ repoId: string }> }) {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const { repoId } = await context.params

  const repo = await db.repo.findFirst({
    where: { repoId },
  })

  if (!repo) return new NextResponse('Not Found', { status: 404 })
  return NextResponse.json(repo)
}

// PATCH /api/logme/repos/[repoId] - 레포 수정
export async function PATCH(req: NextRequest, context: { params: Promise<{ repoId: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { repoId } = await context.params

    const data = await req.json()

    const updated = await db.repo.update({
      where: {
        repoId,
        // userId,
      },
      data,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('❌ 레포 수정 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/repos/[repoId] - 레포 삭제
export async function DELETE(req: NextRequest, context: { params: Promise<{ repoId: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { repoId } = await context.params

    const deleted = await db.repo.delete({
      where: {
        repoId,
        // userId,
      },
    })

    return NextResponse.json(deleted)
  } catch (err) {
    console.error('❌ 레포 삭제 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
