import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'

// POST /api/logme/sites - 사이트 생성
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const site = await db.site.create({
      data: {
        ...data,
      },
    })
    return NextResponse.json(site)
  } catch (err) {
    console.error('❌ 사이트 생성 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// GET /api/logme/sites - 내 사이트 목록 조회
export async function GET() {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const sites = await db.site.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        siteType: true,
        siteTitle: true,
        siteDescription: true,
        domainType: true,
        domain: true,
        status: true,
        createdAt: true,
        template: {
          select: {
            templateTitle: true,
          },
        },
        contentSource: {
          select: {
            sourceType: true,
            sourceId: true,
            sourceUrl: true,
          },
        },
        repo: {
          select: {
            repoName: true,
            repoUrl: true,
          },
        },
        deployTarget: {
          select: {
            targetName: true,
            targetUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sites)
  } catch (err) {
    console.error('❌ 사이트 목록 불러오기 실패:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
