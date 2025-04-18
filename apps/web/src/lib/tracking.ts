import { db } from "@repo/db"

export async function trackEvent({
  userId,
  event,
  meta = {},
}: {
  userId?: string | null
  event: string
  meta?: Record<string, any>
}) {
  try {
    await db.eventLog.create({
      data: {
        userId,
        event,
        meta,
      },
    })
  } catch (err) {
    console.error('🔴 Failed to track event:', event, err)
  }
}