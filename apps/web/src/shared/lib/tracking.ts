/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/shared/lib/logger'

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
    await fetch('/api/logme/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, event, meta }),
    })
  } catch (error) {
    logger.log('error', '🔴 Failed to track event:', { userId, event, error })
  }
}
