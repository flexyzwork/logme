import { SLACK_WEBHOOK_URL } from '@/lib/config/server'

export async function sendAlert({
  type,
  message,
  meta,
}: {
  type: 'info' | 'error'
  message: string
  meta?: Record<string, any>
}) {
  if (!SLACK_WEBHOOK_URL) return

  const emoji = type === 'error' ? '🚨' : 'ℹ️'
  const payload = {
    text: `${emoji} *${message}*`,
    attachments: meta ? [{ text: '```' + JSON.stringify(meta, null, 2) + '```' }] : [],
  }

  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}