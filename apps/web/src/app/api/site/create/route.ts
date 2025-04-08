import { db } from '@repo/db'
import { NextResponse } from 'next/server'

import { enqueueAndWait, JobType } from '@repo/queue'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const { notionPageId, siteSlug, userId } = await req.json()

  // 1. DB에 site 엔트리 생성
  const site = await db.site.create({
    data: {
      userId,
      slug: siteSlug,
      contentSourceId: notionPageId,
      status: 'queued',
      siteTitle: 'site-title',
      siteDescription: 'site-description',
    },
  })

  // 2. 워커용 빌드 큐에 등록
  await enqueueAndWait(JobType.GenerateSite, {
    siteId: site.id,
    userId,
    slug: site.slug,
    contentSourceId: site.contentSourceId,
    siteTitle: site.siteTitle,
    siteDescription: site.siteDescription,
  })
  revalidatePath('/')

  return NextResponse.json({ ok: true, siteId: site.id })
}
