import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/shared/lib/auth'
import logger from '@/shared/lib/logger'

// GET /api/logme/deployTarget/[id] - Fetch a single deploy target
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

// PATCH /api/logme/deployTarget/[id] - Update deploy target
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
  } catch (error) {
    logger.log('error', '❌ Failed to update deploy target:', { error })
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/deployTarget/[id] - Delete deploy target
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
  } catch (error) {
    logger.log('error', '❌ Failed to delete deploy target:', { error })
    return new NextResponse('Bad Request', { status: 400 })
  }
}
