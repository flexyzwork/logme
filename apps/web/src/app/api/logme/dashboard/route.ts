import { NextResponse } from 'next/server'
import { db } from '@repo/db'
import { getAuthSession } from '@/shared/lib/auth'

export async function GET() {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const userId = session.user.id
  const provider = await db.provider.findFirst({
    where: { userId },
    include: {
      providerExtended: {
        select: {
          providerType: true,
          extendedKey: true,
          extendedValue: true,
        },
      },
    },
  })

  const auth = provider?.providerExtended || []

  const sites = await db.site.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ user: { id: userId }, auth, sites })
}
