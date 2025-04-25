import { NextRequest, NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
import { deleteVercelProject, deleteGithubRepo } from '@/services/logme/deleteExternals'
import { fetchGithubInstallationToken } from '@/services/logme/auth'
import { decrypt } from '@/lib/crypto'
import logger from '@/lib/logger'

// GET /api/logme/sites/[id] - 사이트 조회 (단건)
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

// PATCH /api/logme/sites/[id] - 사이트 수정
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
  } catch (err) {
    logger.log('error', '❌ 사이트 수정 실패:', { err })
    return new NextResponse('Bad Request', { status: 400 })
  }
}

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

    // vercel 토큰 가져오기
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
      throw new Error('Vercel 토큰이 없습니다.')
    }
    const vercelToken = decrypt(encryptedToken)

    try {
      // Vercel 프로젝트 삭제
      if (site.deployTarget?.targetId && vercelToken) {
        await deleteVercelProject(vercelToken, site.deployTarget.targetId)
      }

      // gitbub app installationId 가져와서 토큰 발급받기
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

      // GitHub 저장소 삭제
      if (site.repo?.repoOwner && site.repo?.repoName && githubInstallationId) {
        const installationToken = await fetchGithubInstallationToken(Number(githubInstallationId))
        await deleteGithubRepo({
          installationToken,
          owner: site.repo.repoOwner,
          repo: site.repo.repoName,
        })
      }
    } catch (externalError) {
      console.warn('⚠️ 외부 리소스 삭제 실패 (무시하고 진행)', externalError)
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
  } catch (err) {
    logger.log('error', '❌ 사이트 삭제 실패:', { err })
    return new NextResponse('Bad Request', { status: 400 })
  }
}
