import { getAuthSession } from '@/lib/auth'
import { decrypt } from '@/lib/crypto'
import logger from '@/lib/logger'
import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID!
const VERCEL_API_URL = 'https://api.vercel.com/v9'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sub, vercelProjectId } = body

    // 1. 사용자 서브도메인 생성 (예: user123.logme.click)
    const subdomain = `${sub}.logme.click`
    logger.log('info', 'subdomain:', { subdomain })

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

    const providerExtended = await db.providerExtended.findUnique({
      where: {
        providerId_extendedKey: {
          providerId: provider.id,
          extendedKey: 'token',
        },
      },
    })

    const encryptedVercelTokenData = providerExtended?.extendedValue

    if (!encryptedVercelTokenData) {
      return NextResponse.json({ error: 'Vercel token not found' }, { status: 400 })
    }
    const vercelToken = decrypt(encryptedVercelTokenData)

    logger.log('info', 'vercelProjectId:', { vercelProjectId })
    if (!subdomain || !vercelToken || !vercelProjectId) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 })
    }

    // 2. Vercel 도메인 등록 시도
    const domainRes = await fetch(`${VERCEL_API_URL}/projects/${vercelProjectId}/domains`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: subdomain }),
    })

    const domainData = await domainRes.json()

    // 3. TXT 레코드 추가
    if (domainData?.verified === false && domainData?.verification?.length > 0) {
      const { domain: txtName, value: txtValue } = domainData.verification[0]

      await fetch(`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'TXT',
          name: txtName,
          content: txtValue,
          ttl: 60,
        }),
      })
    }

    return NextResponse.json({ success: true, domain: subdomain })
  } catch (error) {
    logger.log('error', '도메인 자동 연결 실패:', { error })
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
