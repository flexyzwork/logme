import { NextRequest, NextResponse } from 'next/server'
import { createId } from '@paralleldrive/cuid2'
import { ProviderType } from '@repo/types'
import { getAuthSession } from '@/shared/lib/auth'
import { db } from '@repo/db'
import logger from '@/shared/lib/logger'

export async function POST(req: Request) {
  try {
    const { providerType, templateId = null, extendedKey, extendedValue } = await req.json()
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id

    if (!providerType || !extendedKey) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const provider = await db.provider.findFirst({
      where: { userId, providerType: providerType },
    })

    if (!provider) {
      return NextResponse.json({ value: null })
    }

    const providerId = provider.id

    let existing

    // Check if providerExtended already exists
    if (templateId) {
      existing = await db.providerExtended.findUnique({
        where: { providerId_extendedKey_templateId: { providerId, extendedKey, templateId } },
      })
    } else {
      existing = await db.providerExtended.findFirst({
        where: { providerId, extendedKey },
      })
    }

    let result
    if (existing) {
      // 🔄 Update existing providerExtended
      result = await db.providerExtended.update({
        where: { id: existing.id },
        data: {
          extendedKey,
          extendedValue,
          templateId,
        },
      })
    } else {
      // ➕ Create new providerExtended
      result = await db.providerExtended.create({
        data: {
          id: createId(),
          providerType,
          templateId,
          extendedKey,
          extendedValue,
          providerId,
        },
      })
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch (error) {
    logger.log('error', '❌ Failed to save provider extended info:', { error })
    return NextResponse.json({ error: 'Failed to save provider extended info' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id

    const { searchParams } = new URL(req.url)
    const providerType = searchParams.get('providerType')
    const extendedKey = searchParams.get('extendedKey')
    const templateId =
      searchParams.get('templateId') === 'undefined' ? null : searchParams.get('templateId')

    if (!providerType || !extendedKey) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const provider = await db.provider.findFirst({
      where: { userId, providerType: providerType as ProviderType },
    })

    if (!provider) {
      return NextResponse.json({ value: null })
    }

    const extended = await db.providerExtended.findFirst({
      where: {
        providerId: provider.id,
        extendedKey,
        templateId,
      },
    })

    return NextResponse.json({ value: extended?.extendedValue ?? null })
  } catch (error) {
    logger.log('error', '❌ Failed to fetch provider extended value:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
