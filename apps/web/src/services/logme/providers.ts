import { db } from '@repo/db'
import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import { ProviderType } from '@repo/types'
import jwt from 'jsonwebtoken'
import os from 'os'
import logger from '@/lib/logger'

const GITHUB_APP_ID = process.env.GITHUB_APP_ID!
let GITHUB_PRIVATE_KEY = ''
const isMac = os.platform() === 'darwin'

if (isMac) {
  GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY!.replace(/\\\n/g, '\n')
} else {
  GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, '\n')
}

export async function handleGithub(req: Request, userId: string) {
  try {
    const { installationId } = await req.json()

    if (!installationId) {
      return NextResponse.json({ error: 'Missing installationId' }, { status: 400 })
    }

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: GITHUB_APP_ID!,
        privateKey: GITHUB_PRIVATE_KEY!,
        installationId: installationId,
      },
    })

    const installation = await octokit.rest.apps.getInstallation({
      installation_id: installationId,
    })

    const account = installation.data.account

    await db.provider.upsert({
      where: {
        providerType_providerUserId: {
          providerType: ProviderType.github,
          providerUserId: account?.id?.toString() || '',
        },
      },
      update: {
        name: account && 'login' in account ? account.login : 'unknown',
        email: null,
        avatarUrl: account?.avatar_url || null,
        updatedAt: new Date(),
      },
      create: {
        providerType: ProviderType.github,
        providerUserId: account?.id?.toString() || '',
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

    // JWT 생성
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iat: now,
      exp: now + 60 * 10, // 10분 후 만료
      iss: GITHUB_APP_ID,
    }

    const token = jwt.sign(payload, GITHUB_PRIVATE_KEY, {
      algorithm: 'RS256',
    })

    // 연결 토큰 요청
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
        { error: 'Failed to request installation token', detail: data },
        { status: res.status }
      )
    }

    return NextResponse.json({
      token: data.token,
      expires_at: data.expires_at,
    })
  } catch (error) {
    logger.log('error', '❌ Failed to issue GitHub App token:', { error })
    return NextResponse.json({ error: 'Internal Server Error', detail: String(error) }, { status: 500 })
  }
}

export async function handleNotion(req: Request) {
  try {
    const { code, state } = await req.json()

    if (!code || !state) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 })
    }

    const stateParts = state.split(':')
    const clientId = stateParts[1]

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
    return NextResponse.json({ error: 'Missing Vercel token' }, { status: 400 })
  }

  const res = await fetch('https://api.vercel.com/www/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch Vercel user information' }, { status: 401 })
  }

  const data = await res.json()
  const user = data?.user

  return NextResponse.json({ user })
}
