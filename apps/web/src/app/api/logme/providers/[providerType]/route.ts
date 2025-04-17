import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { handleGithub, handleNotion, handleVercel } from '@/services/logme/providers'

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

    if (providerType === 'notion') {
      return await handleNotion(req)
    } else if (providerType === 'github') {
      return await handleGithub(req)
    } else if (providerType === 'vercel') {
      return await handleVercel(req)
    } else {
      return NextResponse.json({ error: 'Unsupported provider type' }, { status: 400 })
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
    const { providerType } = (await context.params) as {
      providerType: 'notion' | 'github' | 'vercel'
    }

    if (!providerType) {
      return NextResponse.json({ error: 'providerType is required' }, { status: 400 })
    }

    const provider = await db.provider.findFirst({
      where: { providerType },
    })

    if (!provider) {
      return NextResponse.json(null, { status: 200 })
    }

    return NextResponse.json(provider)
  } catch (error) {
    console.error('❌ provider GET error:', error)
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

    // const { userId } = await req.json()
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    console.log('userId:', userId)

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
