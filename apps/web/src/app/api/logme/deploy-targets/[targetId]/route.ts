import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
// import { getUserFromSession } from '@/lib/session/sessionStore'

// GET /api/logme/deployTarget/[id] - 배포 프로젝트 조회 (단건)
export async function GET(req: NextRequest, context: { params: Promise<{ targetId: string }> }) {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const { targetId } = await context.params

  const deployTarget = await db.deployTarget.findFirst({
    where: {
      targetId,
    },
  })

  if (!deployTarget) return new NextResponse('Not Found', { status: 404 })
  return NextResponse.json(deployTarget)
}

// PATCH /api/logme/deployTarget/[id] - 배포 프로젝트 수정
export async function PATCH(req: NextRequest, context: { params: Promise<{ targetId: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { targetId } = await context.params
    const data = await req.json()

    const updated = await db.deployTarget.update({
      where: {
        targetId,
      },
      data,
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('❌ 배포 프로젝트 수정 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/deployTarget/[id] - 배포 프로젝트 삭제
export async function DELETE(req: NextRequest, context: { params: Promise<{ targetId: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { targetId } = await context.params

    const deleted = await db.deployTarget.delete({
      where: {
        targetId,
        // userId,
      },
    })

    return NextResponse.json(deleted)
  } catch (err) {
    console.error('❌ 배포 프로젝트 삭제 실패:', err)
    return new NextResponse('Bad Request', { status: 400 })
  }
}
