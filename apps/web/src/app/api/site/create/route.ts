import { db } from '@repo/db'
import { NextResponse } from 'next/server'
import { enqueueAndWait, JobType } from '@repo/queue'
import { revalidatePath } from 'next/cache'
import { BuildStatus } from '@prisma/client'

export async function POST(req: Request) {
  const { notionPageId, siteSlug, userId, siteTitle, siteDescription } = await req.json()

  // 1. DB에 site 엔트리 생성
  const site = await db.site.create({
    data: {
      userId,
      slug: siteSlug,
      siteTitle,
      siteDescription,
      contentSourceId: notionPageId,
    },
  })

  // 2. DB에 빌드 엔트리 생성
  const build = await db.build.create({
    data: {
      siteId: site.id,
      status: BuildStatus.pending,
    },
  })

  // 3. 빌드 상태를 pending -> queued로 변경
  await db.build.update({
    where: { id: build.id },
    data: {
      status: BuildStatus.queued,
      queuedAt: new Date(),
    },
  })

  // 4. 큐에 작업 추가
  await enqueueAndWait(JobType.GenerateSite, {
    siteId: site.id,
    buildId: build.id,
    userId,
    slug: site.slug,
    siteTitle: site.siteTitle,
    siteDescription: site.siteDescription,
    contentSourceId: site.contentSourceId,
  })
  revalidatePath('/')

  return NextResponse.json({ ok: true, siteId: site.id })
}
