import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const GITHUB_APP_ID = process.env.GITHUB_APP_ID!
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY!.replace(/\\\n/g, '\n') // PEM 포맷 복구

export async function POST(req: Request) {
  try {
    const { installationId } = await req.json()

    console.log('installationId:', installationId)

    if (!installationId) {
      return NextResponse.json({ error: 'installationId 누락' }, { status: 400 })
    }

    // 1️⃣ JWT 생성
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iat: now,
      exp: now + 60 * 10, // 10분 후 만료
      iss: GITHUB_APP_ID,
    }

    const token = jwt.sign(payload, GITHUB_PRIVATE_KEY, {
      algorithm: 'RS256',
    })
    console.log('token:', token)

    // 2️⃣ 설치 토큰 요청
    const res = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      },
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Installation token 요청 실패', detail: data },
        { status: res.status },
      )
    }

    return NextResponse.json({
      token: data.token,
      expires_at: data.expires_at,
    })
  } catch (error) {
    console.error('GitHub App 토큰 발급 실패:', error)
    return NextResponse.json({ error: '서버 오류', detail: String(error) }, { status: 500 })
  }
}
