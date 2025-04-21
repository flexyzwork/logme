/* eslint-disable @typescript-eslint/no-explicit-any */
export async function sendAlertFromClient({
  type,
  message,
  meta,
}: {
  type: 'info' | 'error'
  message: string
  meta?: Record<string, any>
}) {
  try {
    await fetch('/api/internal/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message, meta }),
    })
  } catch (err) {
    console.error('🔴 Failed to send alert from client:', err)
  }
}
