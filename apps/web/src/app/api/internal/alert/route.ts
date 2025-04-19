import { SLACK_WEBHOOK_URL } from '@/lib/config/server'

export async function sendAlertToServer({
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

export async function POST(req: Request) {
  const { type, message, meta } = await req.json()
  await sendAlertToServer({ type, message, meta })
  return new Response('ok')
}
