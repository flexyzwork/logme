import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/shared/lib/auth'
import { handleGithub, handleNotion, handleVercel } from '@/modules/logme/features/provider/services/providers'
import logger from '@/shared/lib/logger'

const providerLocks = new Map<string, boolean>()

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ providerType: string }> }
) {
  try {
    const { providerType } = (await context.params) as {
      providerType: 'notion' | 'github' | 'vercel'
    }

    if (!providerType) {
      return NextResponse.json({ error: 'providerType is required' }, { status: 400 })
    }

    const session = await getAuthSession()
    const sessionId = session?.user?.id || 'anonymous'
    const lockKey = `${sessionId}-${providerType}`

    if (providerLocks.get(lockKey)) {
      return NextResponse.json({ error: 'Request already in progress' }, { status: 429 })
    }

    providerLocks.set(lockKey, true)

    try {
      if (providerType === 'notion') {
        return await handleNotion(req)
      } else if (providerType === 'github') {
        return await handleGithub(req, sessionId)
      } else if (providerType === 'vercel') {
        return await handleVercel(req)
      } else {
        return NextResponse.json({ error: 'Unsupported provider type' }, { status: 400 })
      }
    } finally {
      providerLocks.delete(lockKey)
    }
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ providerType: string }> }
) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    const { providerType } = (await context.params) as {
      providerType: 'notion' | 'github' | 'vercel'
    }

    if (!providerType) {
      return NextResponse.json({ error: 'providerType is required' }, { status: 400 })
    }

    const provider = await db.provider.findFirst({
      where: {
        providerType,
        userId,
      },
      include: {
        providerExtended: true,
      },
    })

    if (!provider) {
      return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json(provider)
  } catch (error) {
    logger.log('error', '❌ provider GET error:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ providerType: string }> }
) {
  try {
    const { providerType } = (await context.params) as {
      providerType: 'notion' | 'github' | 'vercel'
    }

    if (!providerType) {
      return NextResponse.json({ error: 'providerType is required' }, { status: 400 })
    }

    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await db.providerExtended.deleteMany({
      where: {
        providerType: providerType,
        provider: {
          userId,
        },
      },
    })

    await db.provider.deleteMany({
      where: {
        providerType: providerType,
        userId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}
