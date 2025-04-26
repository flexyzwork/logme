import { db, Prisma } from '@repo/db'
import { NextResponse } from 'next/server'
import { createId } from '@paralleldrive/cuid2'
import { generateFallbackEmail } from '@/lib/utils'
import logger from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const { providerType, providerUserId, name, email, image, userId } = await req.json()
    if (!providerType || !providerUserId || !userId) {
      return NextResponse.json(
        { error: 'providerType and providerUserId are required' },
        { status: 400 }
      )
    }

    const providerUserIdStr = String(providerUserId)

    // 1. provider 존재 여부 확인
    let provider = await db.provider.findUnique({
      where: { providerType_providerUserId: { providerType, providerUserId: providerUserIdStr } },
      include: { user: true },
    })

    // 2. provider가 없으면 생성
    if (!provider) {
      const user = await db.user.findUnique({ where: { id: userId } })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      let newEmail = email ?? user.email
      if (!newEmail) {
        newEmail = generateFallbackEmail(providerType, providerUserIdStr)
      }

      const newId = createId()

      const providerData: Prisma.ProviderUncheckedCreateInput = {
        id: newId,
        providerType,
        providerUserId: providerUserIdStr,
        name,
        email: newEmail,
        avatarUrl: image,
        userId: user?.id ?? '',
      }

      if (user?.id) {
        providerData.userId = user.id
      }

      const created = await db.provider.create({
        data: providerData,
      })

      provider = {
        ...created,
        user: user!,
      }
    }

    return NextResponse.json({ providerUserId: providerUserIdStr, userId: provider?.userId })
  } catch (error) {
    logger.log('error', '❌ Provider 저장 오류:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
