import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
import { deleteVercelProject, deleteGithubRepo } from '@/services/logme/deleteExternals'
import { fetchGithubInstallationToken } from '@/services/logme/auth'
import { decrypt } from '@/lib/crypto'
import logger from '@/lib/logger'

// GET /api/logme/sites/[id] - Fetch a single site
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const userId = session.user.id
  const { id } = await context.params
  const site = await db.site.findFirst({
    where: {
      id,
      ...(userId && { userId }),
      deletedAt: null,
    },
  })

  if (!site) return new NextResponse('Not Found', { status: 404 })
  return NextResponse.json(site)
}

// PATCH /api/logme/sites/[id] - Update site
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const { id } = await context.params
    const data = await req.json()

    const updated = await db.site.update({
      where: {
        id,
        ...(userId && { userId }),
        deletedAt: null,
      },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    logger.log('error', '❌ Failed to update site:', { error })
    return new NextResponse('Bad Request', { status: 400 })
  }
}

// DELETE /api/logme/sites/[id] - Delete site
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const { id } = await context.params

    const site = await db.site.findFirst({
      where: {
        id,
        ...(userId && { userId }),
        deletedAt: null,
      },
      include: {
        deployTarget: true,
        repo: true,
      },
    })

    if (!site) return new NextResponse('Not Found', { status: 404 })

    // Fetch Vercel token
    const vercelTokenData = await db.providerExtended.findFirst({
      where: {
        provider: {
          userId: site.userId,
          providerType: 'vercel',
        },
        extendedKey: 'token',
      },
    })

    const encryptedToken = vercelTokenData?.extendedValue
    if (!encryptedToken) {
      throw new Error('Missing Vercel token')
    }
    const vercelToken = decrypt(encryptedToken)

    try {
      // Delete Vercel project
      if (site.deployTarget?.targetId && vercelToken) {
        await deleteVercelProject(vercelToken, site.deployTarget.targetId)
      }

      // Get GitHub app installationId and issue token
      const logmeInstallationIdData = await db.providerExtended.findFirst({
        where: {
          provider: {
            userId: site.userId,
            providerType: 'github',
          },
          extendedKey: 'logmeInstallationId',
        },
      })

      const githubInstallationId = logmeInstallationIdData?.extendedValue

      // Delete GitHub repository
      if (site.repo?.repoOwner && site.repo?.repoName && githubInstallationId) {
        const installationToken = await fetchGithubInstallationToken(Number(githubInstallationId))
        await deleteGithubRepo({
          installationToken,
          owner: site.repo.repoOwner,
          repo: site.repo.repoName,
        })
      }
    } catch (externalError) {
      logger.log('warn', '⚠️ Failed to delete external resources (ignoring)', { externalError })
    }

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
