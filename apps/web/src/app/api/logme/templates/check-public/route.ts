import { getAuthSession } from '@/shared/lib/auth'
import { decrypt } from '@/shared/lib/crypto'
import logger from '@/shared/lib/logger'
import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { notionPageId, templateId } = await req.json()

  if (!notionPageId) {
    return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
  }
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const userId = session.user.id
  const provider = await db.provider.findFirst({
    where: { userId, providerType: 'notion' },
  })

  if (!provider) {
    return NextResponse.json({ error: 'Notion provider not found' }, { status: 404 })
  }

  const providerExtended = await db.providerExtended.findFirst({
    where: {
      providerId: provider.id,
      templateId,
      extendedKey: 'token',
    },
  })

  const encryptedNotionTokenData = providerExtended?.extendedValue

  if (!encryptedNotionTokenData) {
    return NextResponse.json({ error: 'Notion token not found' }, { status: 400 })
  }
  const notionToken = decrypt(encryptedNotionTokenData)
  try {
    const notionApiUrl = `https://api.notion.com/v1/pages/${notionPageId}`
    const response = await fetch(notionApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Notion page' },
        { status: response.status }
      )
    }

    const data = await response.json()

    const isPublic = !!data.public_url // Check if the page is published

    return NextResponse.json({ isPublic })
  } catch (error) {
    logger.log('error', 'Notion API error:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
