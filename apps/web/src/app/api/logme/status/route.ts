import { getAuthSession } from '@/shared/lib/auth'
import { db } from '@repo/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getAuthSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const userId = session.user.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sites = await db.site.findMany({ where: { userId } })
  const notionProvider = await db.provider.findFirst({
    where: { userId, providerType: 'notion' },
  })

  const inProgress = false

  return NextResponse.json({
    userId,
    siteCount: sites.length,
    notionConnected: !!notionProvider,
    inProgress,
  })
}
