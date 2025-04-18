import { db } from '@repo/db'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
// import { getAuthSession } from '@/lib/auth'
import { ProviderType } from '@prisma/client'

const GITHUB_APP_ID = process.env.GITHUB_APP_ID!
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY!.replace(/\\\n/g, '\n') // PEM 포맷 복구

export async function handleGithub(req: Request, userId: string) {
  try {
    const { installationId } = await req.json()

    console.log('installationId:', installationId)

    if (!installationId) {
      return NextResponse.json({ error: 'installationId 누락' }, { status: 400 })
    }

    // 이 부분이 문제였음!!!!
    // const session = await getAuthSession()
    // if (!session) {
    //   return new NextResponse('Unauthorized', { status: 401 })
    // }
    // const userId = session.user.id
    // if (!userId) {
    //   return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    // }
    console.log('userId:', userId)
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: GITHUB_APP_ID!,
        privateKey: GITHUB_PRIVATE_KEY!,
        installationId: installationId, // 전달받은 installation_id
      },
    })

    const installation = await octokit.rest.apps.getInstallation({
      installation_id: installationId,
    })

    console.log('installation:', installation)

    const account = installation.data.account
    // account.login, account.id, account.type 등
    console.log('account:', account)

    // if (!account) {
    //   return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    // }

    await db.provider.upsert({
      where: {
        providerType_providerUserId: {
          providerType: ProviderType.github,
          providerUserId: account?.id?.toString() || '', // Fallback to an empty string if account or id is null
        },
      },
      update: {
        name: account && 'login' in account ? account.login : 'unknown',
        email: null, // OAuth가 아니므로 null
        avatarUrl: account?.avatar_url || null, // 필요 시 REST API로 추가 fetch 가능
        updatedAt: new Date(),

        // 이 부분도 문제였음!!!!
        // providerExtended: {
        //   deleteMany: {
        //     extendedKey: 'logmeInstallationId',
        //   },
        // },
      },
      create: {
        providerType: ProviderType.github,
        providerUserId: account?.id?.toString() || '', // Fallback to an empty string if account or id is null
        name: account && 'login' in account ? account.login : 'unknown',
        email: null,
        avatarUrl: account?.avatar_url || null,
        user: {
          connect: {
            id: userId,
          },
        },
        providerExtended: {
          create: {
            providerType: ProviderType.github,
            extendedKey: 'logmeInstallationId',
            extendedValue: installationId.toString(),
          },
        },
      },
    })

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

    // 2️⃣ 연결 토큰 요청
    const res = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Installation token 요청 실패', detail: data },
        { status: res.status }
      )
    }

    return NextResponse.json({
      token: data.token,
      expires_at: data.expires_at,
    })
    // 2️⃣ 연결 토큰 요청
    // const res = (await octokit.auth({
    //   type: 'installation',
    //   installationId,
    // })) as { token: string }

    // const data = res.token

    // if (!data) {
    //   return NextResponse.json(
    //     { error: 'Installation token 요청 실패' },
    //     { status: 400 }
    //   )
    // }

    // return NextResponse.json({
    //   token: data,
    //   expires_at: null, // No expiration info available
    // })
  } catch (error) {
    console.error('GitHub App 토큰 발급 실패:', error)
    return NextResponse.json({ error: '서버 오류', detail: String(error) }, { status: 500 })
  }
}

export async function handleNotion(req: Request) {
  try {
    const { code, state } = await req.json()

    console.log('code, state:', { code, state })

    if (!code || !state) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 })
    }

    const stateParts = state.split(':')
    const clientId = stateParts[1]

    console.log('클라이언트 ID:', clientId)

    const app = await db.templateApp.findFirst({
      where: { appClientId: clientId },
    })

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${clientId}:${app?.appClientSecret}`).toString(
          'base64'
        )}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: app?.appRedirectUri,
      }),
    })

    const data = await response.json()

    console.log('data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to exchange token: ${data.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })
  }
}

export async function handleVercel(req: Request) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ error: '토큰 누락' }, { status: 400 })
  }

  const res = await fetch('https://api.vercel.com/www/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Vercel 사용자 정보 조회 실패' }, { status: 401 })
  }

  const data = await res.json()
  const user = data?.user
  console.log('user', user)

  return NextResponse.json({ user })
}
