import { db } from '@repo/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
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
