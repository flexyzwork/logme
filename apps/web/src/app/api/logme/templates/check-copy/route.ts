import { getAuthSession } from '@/lib/auth'
import { decrypt } from '@/lib/crypto'
import logger from '@/lib/logger'
import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { notionPageId, templateId } = await req.json()

  logger.log('info', 'Notion page ID:', notionPageId)
  logger.log('info', 'Template ID:', templateId)

  if (!notionPageId) {
    return NextResponse.json({ error: 'Unauthorized or missing parameters' }, { status: 401 })
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
  logger.log('info', 'Encrypted notion token:', { encryptedNotionTokenData })

  if (!encryptedNotionTokenData) {
    return NextResponse.json({ error: 'Notion token not found' }, { status: 400 })
  }
  const notionToken = decrypt(encryptedNotionTokenData)
  logger.log('info', 'Notion token:', { notionToken })
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
      return NextResponse.json({ isCopied: false, status: response.status }) // Not yet copied
    }

    return NextResponse.json({ isCopied: true })
  } catch (error) {
    logger.log('error', 'Notion API Error:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
