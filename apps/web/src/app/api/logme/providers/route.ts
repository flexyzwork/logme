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

    // 1. Check if provider exists
    let provider = await db.provider.findUnique({
      where: { providerType_providerUserId: { providerType, providerUserId: providerUserIdStr } },
      include: { user: true },
    })

    // 2. Create provider if not exists
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
    logger.log('error', '❌ Failed to save provider:', { error })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
