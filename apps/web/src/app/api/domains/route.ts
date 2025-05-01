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
    const { sub, vercelProjectId, siteId } = body

    // 1. 사용자 서브도메인 생성 및 연결준비
    const subdomain = `${sub}.logme.click`
    const deployDomain = `logme-${sub}.vercel.app`

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

    // 2. Cloudflare CNAME 생성 또는 업데이트
    const cnameRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'CNAME',
          name: subdomain,
          content: deployDomain,
          ttl: 60,
          proxied: false,
        }),
      }
    )

    const cnameData = await cnameRes.json()

    if (!cnameData.success && cnameData.errors?.some((e: { code: number }) => e.code === 81057)) {
      // 기존 레코드 있음 → 업데이트 필요
      const existingRes = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records?type=CNAME&name=${subdomain}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const existingData = await existingRes.json()
      const recordId = existingData.result?.[0]?.id

      if (recordId) {
        await fetch(
          `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'CNAME',
              name: subdomain,
              content: deployDomain,
              ttl: 60,
              proxied: false,
            }),
          }
        )
      }
    }

    // 3. Vercel 프로젝트에 도메인 추가
    const domainRes = await fetch(`${VERCEL_API_URL}/projects/${vercelProjectId}/domains`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: subdomain }),
    })

    const domainData = await domainRes.json()

    // 4. (필요시) Vercel TXT 인증 레코드 추가
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

    // 5. 도메인 인증 대기 테이블에 추가
    await db.domainVerification.create({
      data: {
        subdomain,
        vercelProjectId,
        providerId: provider.id,
        verified: false,
        siteId
      },
    })

    // // Enqueue background verification job
    // const { queue, JobType } = await import('@repo/queue')
    // await queue.add(JobType.CheckDomain, {
    //   domain: subdomain,
    //   vercelProjectId,
    //   vercelToken,
    //   providerId: provider.id,
    // })

    return NextResponse.json({ success: true, domain: subdomain })
  } catch (error) {
    logger.log('error', '도메인 자동 연결 실패:', { error })
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
