import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
import logger from '@/lib/logger'

// GET /api/logme/repos/[repoId] - Fetch a single repository
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

// PATCH /api/logme/repos/[repoId] - Update repository
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
      },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    logger.log('error', '❌ Failed to update repository:', { error })
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/repos/[repoId] - Delete repository
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
      },
    })

    return NextResponse.json(deleted)
  } catch (error) {
    logger.log('error', '❌ Failed to delete repository:', { error })
    return new NextResponse('Bad Request', { status: 400 })
  }
}
