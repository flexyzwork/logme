import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/lib/auth'
import logger from '@/lib/logger'

// POST /api/logme/sites - Create a new site
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const site = await db.site.create({
      data: {
        ...data,
        userId,
      },
    })
    console.log('Site created successfully:', site)
    return NextResponse.json(site)
  } catch (error) {
    logger.log('error', '❌ Failed to create site:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// GET /api/logme/sites - Fetch my site list
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
        sub: true,
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
            thumbnailUrl: true,
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
            deployments: {
              select: {
                deployUrl: true,
              },
            },
          },
        },
        domainVerifications: {
          select: {
            subdomain: true,
            verified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(sites)
  } catch (error) {
    logger.log('error', '❌ Failed to fetch site list:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
