// 📁 app/api/domains/route.ts (Next.js 15, App Router 기반)

import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID!
const VERCEL_API_URL = 'https://api.vercel.com/v9'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      sub,
      // siteId,
      vercelToken,
      vercelProjectId,
    } = body

    // 1. 사용자 서브도메인 생성 (예: user-123.logme.click)
    const subdomain = `${sub}.logme.click`
    logger.info('subdomain:', { subdomain })
    logger.info('vercelToken:', { vercelToken })
    logger.info('vercelProjectId:', { vercelProjectId })
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

    // 3. 이미 등록되었거나 verification 필요할 경우 TXT 레코드 추가
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
  } catch (e) {
    console.error('도메인 자동 연결 실패:', e)
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
