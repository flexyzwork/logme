import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { code } = await req.json()

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  console.log('📥 요청된 GitHub code:', code)
  console.log('🔑 GitHub Client ID:', process.env.GITHUB_CLIENT_ID)
  console.log('🔑 GitHub Client Secret:', process.env.GITHUB_CLIENT_SECRET)

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }).toString()
    })

    const tokenData = await tokenRes.json()

    console.log('📡 GitHub 토큰 응답:', tokenData)

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token', details: tokenData },
        { status: 500 },
      )
    }

    const accessToken = tokenData.access_token

    console.log('🔑 발급된 access_token:', accessToken)

    // GitHub 사용자 정보 요청
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    const user = await userRes.json()

    console.log('👤 GitHub 사용자 정보:', user)

    return NextResponse.json({
      access_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        login: user.login,
      },
    })
  } catch (err) {
    console.error('❌ GitHub OAuth 처리 중 에러:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
