import { getAuthSession } from '@/shared/lib/auth'
import { decrypt } from '@/shared/lib/crypto'
import logger from '@/shared/lib/logger'
import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

const VERCEL_API_BASE_URL = 'https://api.vercel.com'

export async function POST(req: NextRequest) {
  try {
    const { deploymentId } = await req.json()

    if (!deploymentId) {
      return NextResponse.json({ error: 'Missing deploymentId' }, { status: 400 })
    }

    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userId = session.user.id
    const provider = await db.provider.findFirst({
      where: { userId, providerType: 'vercel' },
    })

    if (!provider) {
      return NextResponse.json({ error: 'Vercel provider not found' }, { status: 404 })
    }

    const providerExtended = await db.providerExtended.findFirst({
      where: {
        providerId: provider.id,
        extendedKey: 'token',
      },
    })

    const encryptedVercelTokenData = providerExtended?.extendedValue

    if (!encryptedVercelTokenData) {
      return NextResponse.json({ error: 'Vercel token not found' }, { status: 400 })
    }
    const vercelToken = decrypt(encryptedVercelTokenData)

    const res = await fetch(`${VERCEL_API_BASE_URL}/v13/deployments/${deploymentId}`, {
      headers: {
        Authorization: `Bearer ${vercelToken}`,
      },
    })

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    logger.log('error', '❌ Failed to fetch deployment status:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
