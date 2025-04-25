import { NextRequest, NextResponse } from 'next/server'
import { createId } from '@paralleldrive/cuid2'
import { ProviderType } from '@prisma/client'
import { getAuthSession } from '@/lib/auth'
import { db } from '@repo/db'
import logger from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const { providerType, templateId = null, extendedKey, extendedValue } = await req.json()
    const session = await getAuthSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const userId = session.user.id

    if (!providerType || !extendedKey) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }

    const provider = await db.provider.findFirst({
      where: { userId, providerType: providerType },
    })

    if (!provider) {
      return NextResponse.json({ value: null })
    }

    const providerId = provider.id

    let existing

    // 기존 providerExtended 여부 확인
    if (templateId) {
      existing = await db.providerExtended.findFirst({
        where: { providerId, templateId, extendedKey },
      })
    } else {
      existing = await db.providerExtended.findUnique({
        where: { providerId_extendedKey: { providerId, extendedKey } },
      })
    }

    let result
    if (existing) {
      // 🔄 업데이트
      result = await db.providerExtended.update({
        where: { id: existing.id },
        data: {
          extendedKey,
          extendedValue,
          templateId,
        },
      })
    } else {
      // ➕ 새로 생성
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
  } catch (err) {
    logger.log('error', '❌ providerExtended 저장 오류:', { err })
    return NextResponse.json({ error: 'providerExtended 저장 실패' }, { status: 500 })
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
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
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
  } catch (err) {
    logger.log('error', '❌ Vercel 토큰 조회 실패:', { err })
    return NextResponse.json({ error: '서버 에러' }, { status: 500 })
  }
}
