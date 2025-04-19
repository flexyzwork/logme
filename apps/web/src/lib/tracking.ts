/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendAlertFromClient } from '@/lib/tracking'

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

    if (event.toLowerCase().includes('fail')) {
      await sendAlertFromClient({
        type: 'error',
        message: `📛 이벤트 실패 감지: ${event}`,
        meta: { userId, meta },
      })
    }
  } catch (err) {
    console.error('🔴 Failed to track event:', event, err)
  }
}