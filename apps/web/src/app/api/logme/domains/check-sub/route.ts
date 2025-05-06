import { NextResponse } from 'next/server'
import { RESERVED_SUBDOMAINS } from '@/modules/logme/features/site/constants/reserved'
import { db } from '@repo/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sub = searchParams.get('sub')?.toLowerCase()

  if (!sub) {
    return NextResponse.json({ error: 'Missing sub param' }, { status: 400 })
  }

  const isReserved = RESERVED_SUBDOMAINS.some((word) => sub.toLowerCase().startsWith(word))
  if (isReserved) {
    return NextResponse.json({ exists: true, reserved: true })
  }

  const exists = await db.site.findFirst({
    where: { sub, deletedAt: null },
    select: { id: true },
  })

  return NextResponse.json({ exists: !!exists })
}
