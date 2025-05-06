import { db } from '@repo/db'

export async function getSiteByUser(userId: string) {
  return await db.site.findFirst({
    where: { userId },
  })
}
